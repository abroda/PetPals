package com.app.petpals.service;

import com.app.petpals.entity.WalkSession;
import com.app.petpals.payload.location.LocationResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class MQTTLocationService {

    private final MqttClient mqttClient;
    private final RedisLocationService redisLocationService;
    private final WalkSessionService walkSessionService;
    private final ObjectMapper objectMapper;

    public MQTTLocationService(MqttClient mqttClient, RedisLocationService redisLocationService, WalkSessionService walkSessionService, ObjectMapper objectMapper) {
        this.mqttClient = mqttClient;
        this.redisLocationService = redisLocationService;
        this.walkSessionService = walkSessionService;
        this.objectMapper = objectMapper;
        this. objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @PostConstruct
    public void startListening() {
        try {
            // Subscribe to user location updates
            mqttClient.subscribe("location/user/#", (topic, message) -> {
                String payload = new String(message.getPayload());
                System.out.println("Received location update from topic: " + topic + " | Payload: " + payload);

                // Extract user ID from the topic
                String[] topicParts = topic.split("/");
                if (topicParts.length > 2 && "user".equals(topicParts[1])) {
                    String userId = topicParts[2];
                    handleLocationUpdate(userId, payload);
                }
            });

            // Subscribe to walk start and end topics
            mqttClient.subscribe("walk/start/#", (topic, message) -> {
                String userId = topic.split("/")[2];
                String payload = new String(message.getPayload());
                handleWalkStart(userId, payload);
            });

            mqttClient.subscribe("walk/end/#", (topic, message) -> {
                String userId = topic.split("/")[2];
                String payload = new String(message.getPayload());
                handleWalkEnd(userId, payload);
            });

            System.out.println("Subscribed to MQTT topics: location/user/#, walk/start/#, walk/end/#");
        } catch (MqttException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to subscribe to MQTT topics", e);
        }
    }

    // Handle walk start
    private void handleWalkStart(String userId, String payload) {
        try {
            var node = objectMapper.readTree(payload);
            LocalDateTime startTime = Instant.parse(node.get("timestamp").asText())
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();


            // Start a new walk session in the database
            String sessionId = walkSessionService.startWalk(userId, startTime);

            // Initialize metadata in Redis
            redisLocationService.initWalk(userId);

            System.out.println("Walk started for user: " + userId + ", session ID: " + sessionId);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error handling walk start: " + e.getMessage());
        }
    }

    // Handle walk end
    private void handleWalkEnd(String userId, String payload) {
        try {
            var node = objectMapper.readTree(payload);
            LocalDateTime endTime = Instant.parse(node.get("timestamp").asText())
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();

            // Retrieve the most recent active session from the database
            WalkSession session = walkSessionService.findActiveSessionByUserId(userId);
            if (session == null) {
                System.out.println("No active walk found for user: " + userId);
                return;
            }

            String sessionId = session.getId();

            // Retrieve location history from Redis (for distance calculation)
            List<LocationResponse> locations = redisLocationService.getLocationHistory(userId);

            // Calculate total distance walked
            double totalDistance = redisLocationService.calculateTotalDistance(locations);

            // Finalize the session in the database
            walkSessionService.endWalk(sessionId, endTime, totalDistance);

            // Notify nearby users to remove this user
            List<LocationResponse> nearbyUsers = redisLocationService.findNearbyUsersForUser(userId);
            for (LocationResponse nearbyUser : nearbyUsers) {
                String updatedNearbyUsersJson = redisLocationService.updateNearbyUsersForRemoval(nearbyUser.getUserId(), userId);
                publishUpdatedNearbyUsers(nearbyUser.getUserId(), updatedNearbyUsersJson);
            }

            // Clear Redis data for the user
            redisLocationService.clearWalkData(userId);

            System.out.println("Walk ended for user: " + userId + ", total distance: " + totalDistance + " km");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error handling walk end: " + e.getMessage());
        }
    }

    // Publish the updated nearby users list
    private void publishUpdatedNearbyUsers(String userId, String updatedNearbyUsersJson) {
        try {
            String topic = "location/nearby/" + userId;
            mqttClient.publish(topic, new MqttMessage(updatedNearbyUsersJson.getBytes()));
            System.out.println("Updated nearby users for user: " + userId);
        } catch (MqttException e) {
            e.printStackTrace();
            System.err.println("Failed to publish updated nearby users for user: " + userId);
        }
    }

    // Process location updates and proactively publish updates for all affected users
    private void handleLocationUpdate(String userId, String payload) {
        try {
            // Parse the location update payload (JSON)
            LocationResponse userLocation = parseLocation(userId, payload);

            // Store the user's location in Redis
            redisLocationService.updateLocation(userId, userLocation.getLatitude(), userLocation.getLongitude(), userLocation.getTimestamp());

            // Find all users nearby this user
            List<LocationResponse> nearbyUsersForUser = redisLocationService.findNearbyUsers(
                    userLocation.getLatitude(),
                    userLocation.getLongitude(),
                    5.0
            );

            // Publish the updated list of nearby users to this user's topic
            publishNearbyUsers(userId, nearbyUsersForUser);

            // Find all users who would consider this user as "nearby"
            List<String> affectedUsers = redisLocationService.findUsersAffectedBy(userId, userLocation.getLatitude(), userLocation.getLongitude(), 5.0);

            // For each affected user, recompute their nearby list and publish updates
            for (String affectedUser : affectedUsers) {
                List<LocationResponse> nearbyForAffectedUser = redisLocationService.findNearbyUsersForUser(affectedUser);
                publishNearbyUsers(affectedUser, nearbyForAffectedUser);
            }

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error handling location update: " + e.getMessage());
        }
    }

    // Publish a list of nearby users to a specific user's topic
    private void publishNearbyUsers(String userId, List<LocationResponse> nearbyUsers) {
        try {
            // Convert the list of LocationResponse to JSON
            String nearbyUsersJson = objectMapper.writeValueAsString(nearbyUsers);

            // Publish the JSON string to the user's topic
            String topic = "location/nearby/" + userId;
            mqttClient.publish(topic, new MqttMessage(nearbyUsersJson.getBytes()));
            System.out.println("Published nearby users to topic: " + topic);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to publish nearby users for userId " + userId);
        }
    }

    // Helper method to parse location from JSON payload
    private LocationResponse parseLocation(String userId, String payload) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        var node = objectMapper.readTree(payload);

        if (!node.has("latitude") || !node.has("longitude") || !node.has("timestamp")) {
            throw new IllegalArgumentException("Invalid payload: missing required fields (latitude, longitude, or timestamp)");
        }

        double latitude = node.get("latitude").asDouble();
        double longitude = node.get("longitude").asDouble();
        LocalDateTime timestamp = Instant.parse(node.get("timestamp").asText())
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        return new LocationResponse(userId, latitude, longitude, timestamp);
    }
}
