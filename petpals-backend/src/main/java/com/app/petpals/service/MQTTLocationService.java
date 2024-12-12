package com.app.petpals.service;

import com.app.petpals.entity.Dog;
import com.app.petpals.entity.WalkSession;
import com.app.petpals.payload.location.LocationResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import jakarta.annotation.PostConstruct;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class MQTTLocationService {

    private final MqttClient mqttClient;
    private final RedisLocationService redisLocationService;
    private final WalkSessionService walkSessionService;
    private final ObjectMapper objectMapper;
    private final FriendshipService friendshipService;
    private final DogService dogService;
    private final UserService userService;
    private final AWSImageService awsImageService;

    public MQTTLocationService(MqttClient mqttClient, RedisLocationService redisLocationService, WalkSessionService walkSessionService, ObjectMapper objectMapper, FriendshipService friendshipService, DogService dogService, UserService userService, AWSImageService awsImageService) {
        this.mqttClient = mqttClient;
        this.redisLocationService = redisLocationService;
        this.walkSessionService = walkSessionService;
        this.objectMapper = objectMapper;
        this.friendshipService = friendshipService;
        this.dogService = dogService;
        this.awsImageService = awsImageService;
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        this.userService = userService;
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
            LocalDateTime startTime = Instant.parse(node.get("timestamp").asText()).atZone(ZoneId.systemDefault()).toLocalDateTime();
            String visibility = node.has("visibility") ? node.get("visibility").asText() : "PUBLIC";

            // Fetch friends list if FRIENDS_ONLY
            List<String> friends = "FRIENDS_ONLY".equals(visibility) ? friendshipService.getAcceptedFriendshipsForUser(userId) : null;

            // Fetch dog IDs from the payload
            List<String> dogIds = new ArrayList<>();
            if (node.has("dogIds") && node.get("dogIds").isArray()) {
                for (JsonNode dogIdNode : node.get("dogIds")) {
                    dogIds.add(dogIdNode.asText());
                }
            }

            // Validate and fetch Dog entities
            List<Dog> dogs = dogService.getDogsByUserId(userId).stream()
                    .filter(dog -> dogIds.contains(dog.getId()))
                    .toList();

            // Check if all requested dog IDs were found
            if (dogs.size() != dogIds.size()) {
                throw new IllegalArgumentException("One or more dog IDs are invalid or do not belong to the user");
            }

            String groupWalkId = node.has("groupWalkId") ? node.get("groupWalkId").asText() : null;
            // TODO: check if all dogs are signed up for this walk - later

            // Start a new walk session in the database
            String sessionId = walkSessionService.startWalk(userId, startTime, dogs);

            // Adding imageUrl
            String imageId = userService.getById(userId).getProfilePictureId();
            String imageUrl = awsImageService.getPresignedUrl(imageId);

            // Initialize metadata in Redis
            redisLocationService.initWalk(userId, visibility, friends, groupWalkId, imageUrl);

            System.out.println("Walk started for user: " + userId + ", session ID: " + sessionId + ", visibility: " + visibility + ", groupWalkId: " + groupWalkId);
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

            JsonNode locationsNode = node.get("locations");
            List<LocationResponse> locations = new ArrayList<>();
            if (locationsNode.isArray()) {
                for (JsonNode locationNode : locationsNode) {
                    LocationResponse location = parseLocationNode(userId, locationNode);
                    locations.add(location);
                }
            }

            // Retrieve the most recent active session from the database
            WalkSession session = walkSessionService.findActiveSessionByUserId(userId);
            if (session == null) {
                System.out.println("No active walk found for user: " + userId);
                return;
            }

            String sessionId = session.getId();

            // Calculate total distance walked
            int totalDistance = redisLocationService.calculateTotalDistance(locations);

            // Finalize the session in the database
            walkSessionService.endWalk(sessionId, endTime, totalDistance);

            // Notify nearby users to remove this user
            List<LocationResponse> nearbyUsers = redisLocationService.findNearbyUsersForUser(userId);
            for (LocationResponse nearbyUser : nearbyUsers) {
                if (!Objects.equals(nearbyUser.getUserId(), userId)){
                    String updatedNearbyUsersJson = redisLocationService.updateNearbyUsersForRemoval(nearbyUser.getUserId(), userId);
                    publishUpdatedNearbyUsers(nearbyUser.getUserId(), updatedNearbyUsersJson);
                }
            }

            String groupWalkId = node.has("groupWalkId") ? node.get("groupWalkId").asText() : null;
            // Clear Redis data for the user
            redisLocationService.clearWalkData(userId, groupWalkId);
            // TODO: update users location when they leave the walk for other participants
            if (groupWalkId != null && !groupWalkId.isEmpty()) {
                List<LocationResponse> groupWalkLocations = redisLocationService.findGroupWalkParticipantsLocations(groupWalkId);
                for (LocationResponse groupWalkLocation : groupWalkLocations) {
                    publishGroupWalkUsers(groupWalkLocation.getUserId(), groupWalkId, groupWalkLocations);
                }
            }

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

            // Find nearby users that I can see
            List<LocationResponse> nearbyUsers = redisLocationService.findNearbyUsersWithVisibility(userId, userLocation.getLatitude(), userLocation.getLongitude(), 5.0);
            // Publish the updated list of nearby users to my topic
            publishNearbyUsers(userId, nearbyUsers);

            // Find all users who would be able to see me - if private none, if public all, if friends users on my list
            List<String> affectedUsers = redisLocationService.findUsersAffectedByWithVisibility(userId, userLocation.getLatitude(), userLocation.getLongitude(), 5.0);

            // For each affected user, recompute their nearby list and publish updates
            for (String affectedUser : affectedUsers) {
                List<LocationResponse> nearbyForAffectedUser = redisLocationService.findNearbyUsersForUser(affectedUser);
                publishNearbyUsers(affectedUser, nearbyForAffectedUser);
            }

            // TODO: get all locations of group walk participants (if groupWalkId != null)
            var node = objectMapper.readTree(payload);
            String groupWalkId = node.has("groupWalkId") ? node.get("groupWalkId").asText() : null;
            if (groupWalkId != null && !groupWalkId.isEmpty()){
                List<LocationResponse> groupWalkLocations = redisLocationService.findGroupWalkParticipantsLocations(groupWalkId);

                // TODO: publish those locations to requesting user.
//                publishGroupWalkUsers(userId, groupWalkId, groupWalkLocations);

                // TODO: for each participant publish requesting users location.
                for (LocationResponse groupWalkLocation : groupWalkLocations) {
                    publishGroupWalkUsers(groupWalkLocation.getUserId(), groupWalkId, groupWalkLocations);
                }
            }

            // TODO: /location/walk/walkId/userId

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

    // Publish a list of nearby users to a specific user's topic
    private void publishGroupWalkUsers(String userId, String groupWalkId, List<LocationResponse> groupWalkUsers) {
        try {
            // Convert the list of LocationResponse to JSON
            String nearbyUsersJson = objectMapper.writeValueAsString(groupWalkUsers);

            // Publish the JSON string to the user's topic
            String topic = "location/walk/" + groupWalkId + "/" + userId;
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

        return new LocationResponse(userId, latitude, longitude, timestamp, null);
    }

    // Helper method to parse location from JSON payload
    private LocationResponse parseLocationNode(String userId, JsonNode node) throws JsonProcessingException {
        if (!node.has("latitude") || !node.has("longitude") || !node.has("timestamp")) {
            throw new IllegalArgumentException("Invalid payload: missing required fields (latitude, longitude, or timestamp)");
        }

        double latitude = node.get("latitude").asDouble();
        double longitude = node.get("longitude").asDouble();
        LocalDateTime timestamp = Instant.parse(node.get("timestamp").asText())
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        return new LocationResponse(userId, latitude, longitude, timestamp, null);
    }
}
