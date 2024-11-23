package com.app.petpals.service;

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
@RequiredArgsConstructor
public class MQTTLocationService {

    private final MqttClient mqttClient;
    private final RedisLocationService redisLocationService;

    @PostConstruct
    public void startListening() {
        try {
            // Subscribe to all user location topics using wildcard
            mqttClient.subscribe("location/user/#", (topic, message) -> {
                String payload = new String(message.getPayload());
                System.out.println("Received location update from topic: " + topic + " | Payload: " + payload);

                // Extract user ID from the topic (e.g., "location/user/{userId}")
                String[] topicParts = topic.split("/");
                if (topicParts.length > 2 && "user".equals(topicParts[1])) {
                    String userId = topicParts[2];
                    handleLocationUpdate(userId, payload);
                }
            });

            System.out.println("Subscribed to topic: location/user/#");
        } catch (MqttException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to subscribe to MQTT topics", e);
        }
    }

    // Process location updates and publish nearby users
    private void handleLocationUpdate(String userId, String payload) {
        try {
            // Parse the location update payload (JSON)
            LocationResponse userLocation = parseLocation(userId, payload);

            // Store the user's location in Redis
            redisLocationService.updateLocation(userId, userLocation.getLatitude(), userLocation.getLongitude(), userLocation.getTimestamp());

            // Find nearby users within 5 km
            List<LocationResponse> nearbyUsers = redisLocationService.findNearbyUsers(
                    userLocation.getLatitude(),
                    userLocation.getLongitude(),
                    5.0
            );

            // Convert the list of nearby users to JSON
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            String nearbyUsersJson = objectMapper.writeValueAsString(nearbyUsers);

            // Publish the nearby user list to the specific user's topic
            publishNearbyUsers(userId, nearbyUsersJson);

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error handling location update: " + e.getMessage());
        }
    }

    // Publish a list of nearby users to a specific user's topic
    private void publishNearbyUsers(String userId, String nearbyUsers) {
        try {
            String topic = "location/nearby/" + userId;
            mqttClient.publish(topic, new MqttMessage(nearbyUsers.getBytes()));
            System.out.println("Published nearby users to topic: " + topic);
        } catch (MqttException e) {
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
        long timestampMillis = node.get("timestamp").asLong();
        LocalDateTime timestamp = Instant.ofEpochMilli(timestampMillis)
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        return new LocationResponse(userId, latitude, longitude, timestamp);
    }
}
