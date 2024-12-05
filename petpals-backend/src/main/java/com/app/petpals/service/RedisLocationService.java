package com.app.petpals.service;

import com.app.petpals.payload.location.LocationResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RedisLocationService {

    private static final String GEO_KEY = "user_locations";
    private static final String USER_METADATA_KEY = "user_metadata"; // for timestamp on location update
    private static final String VISIBILITY_KEY = "visibility:";
    private static final String FRIENDS_LIST_KEY = "friends_list:";
    private static final String GROUP_WALK_LIST_KEY = "group_walk_list:";

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    // Initialize walk metadata in Redis
    public void initWalk(String userId, String visibility, List<String> friends, String groupWalkId) {
        try {
            // Store visibility
            redisTemplate.opsForValue().set(VISIBILITY_KEY + userId, visibility);

            // If visibility is FRIENDS_ONLY, store the friends list in Redis
            if ("FRIENDS_ONLY".equalsIgnoreCase(visibility) && friends != null && !friends.isEmpty()) {
                String friendsKey = FRIENDS_LIST_KEY + userId; // Define a key for the friends list
                redisTemplate.opsForList().rightPushAll(friendsKey, friends);
            }

            if (groupWalkId != null && !groupWalkId.isEmpty()) {
                String groupWalkKey = GROUP_WALK_LIST_KEY + groupWalkId;
                redisTemplate.opsForList().rightPush(groupWalkKey, userId);
            }

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to initialize walk metadata for user: " + userId);
        }
    }

    // Get visibility setting from Redis
    public String getVisibility(String userId) {
        return redisTemplate.opsForValue().get(VISIBILITY_KEY + userId);
    }

//    // Store friends list in Redis
//    public void setFriendsList(String userId, List<String> friends) {
//        redisTemplate.opsForSet().add(FRIENDS_LIST_KEY + userId, friends.toArray(new String[0]));
//    }
//
//    // Get friends list from Redis
//    public Set<String> getFriendsList(String userId) {
//        return redisTemplate.opsForSet().members(FRIENDS_LIST_KEY + userId);
//    }
//
//    // Add a friend to the list
//    public void addFriend(String userId, String friendId) {
//        redisTemplate.opsForSet().add(FRIENDS_LIST_KEY + userId, friendId);
//    }
//
//    // Remove a friend from the list
//    public void removeFriend(String userId, String friendId) {
//        redisTemplate.opsForSet().remove(FRIENDS_LIST_KEY + userId, friendId);
//    }

    // Add or update a user's location
    public void updateLocation(String userId, double latitude, double longitude, LocalDateTime timestamp) {
        try {
            // Validate coordinates
            if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
                throw new IllegalArgumentException("Invalid latitude/longitude values");
            }

            // Update geospatial data
            redisTemplate.opsForGeo().add(GEO_KEY, new RedisGeoCommands.GeoLocation<>(userId, new Point(longitude, latitude)));

            // Update metadata
            redisTemplate.opsForHash().put(USER_METADATA_KEY, userId, timestamp.toString());
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to update location for user: " + userId);
        }
    }

    // Find nearby users with visibility rules applied - users that I can see on the walk
    public List<LocationResponse> findNearbyUsersWithVisibility(String userId, double latitude, double longitude, double radiusKm) {
        List<LocationResponse> nearbyUsers = findNearbyUsers(latitude, longitude, radiusKm);

        // Apply visibility rules
        return nearbyUsers.stream()
                .filter(user -> {
                    String visibility = getVisibility(user.getUserId());
                    // Include the requesting user's own location
                    if (user.getUserId().equals(userId)) {
                        return true;
                    }

                    // Handle visibility rules for other users
                    if ("PRIVATE".equalsIgnoreCase(visibility)) {
                        return false;
                    } else if ("FRIENDS_ONLY".equalsIgnoreCase(visibility)) {
                        List<String> theirFriendsList = redisTemplate.opsForList().range(FRIENDS_LIST_KEY + user.getUserId(), 0, -1);
                        return theirFriendsList != null && theirFriendsList.contains(userId);
                    }

                    return true; // Allow PUBLIC users
                })
                .collect(Collectors.toList());
    }

    // Find nearby users within a radius (in km)
    public List<LocationResponse> findNearbyUsers(double latitude, double longitude, double radiusKm) {
        try {
            Circle circle = new Circle(new Point(longitude, latitude), new Distance(radiusKm, Metrics.KILOMETERS));

            return Objects.requireNonNull(redisTemplate.opsForGeo()
                            .radius(GEO_KEY, circle))
                    .getContent()
                    .stream()
                    .map(geoResult -> {
                        String userId = geoResult.getContent().getName();
                        Point point = Objects.requireNonNull(redisTemplate.opsForGeo().position(GEO_KEY, userId)).get(0);
                        String timestampStr = (String) redisTemplate.opsForHash().get(USER_METADATA_KEY, userId);
                        LocalDateTime timestamp = timestampStr != null ? LocalDateTime.parse(timestampStr) : null;

                        return new LocationResponse(userId, point.getY(), point.getX(), timestamp);
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to find nearby users");
            return Collections.emptyList();
        }
    }

    public List<LocationResponse> findGroupWalkParticipantsLocations(String groupWalkId) {
        try {
            // Define the Redis key for the group walk
            String groupWalkKey = GROUP_WALK_LIST_KEY + groupWalkId;

            // Get all user IDs in the group walk
            List<String> userIds = redisTemplate.opsForList().range(groupWalkKey, 0, -1);

            if (userIds == null || userIds.isEmpty()) {
                System.out.println("No participants found for group walk: " + groupWalkId);
                return Collections.emptyList();
            }

            // Fetch the latest locations for all users in the group walk
            return userIds.stream()
                    .map(userId -> {
                        try {
                            // Retrieve the user's location from Redis
                            Point point = Objects.requireNonNull(redisTemplate.opsForGeo().position(GEO_KEY, userId)).get(0);
                            String timestampStr = (String) redisTemplate.opsForHash().get(USER_METADATA_KEY, userId);
                            LocalDateTime timestamp = timestampStr != null ? LocalDateTime.parse(timestampStr) : null;

                            // Create and return the LocationResponse
                            return new LocationResponse(userId, point.getY(), point.getX(), timestamp);
                        } catch (Exception e) {
                            System.err.println("Failed to retrieve location for user: " + userId);
                            return null;
                        }
                    })
                    .filter(Objects::nonNull) // Filter out any null results
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to retrieve group walk participants for groupWalkId: " + groupWalkId);
            return Collections.emptyList();
        }
    }


    // Find users affected by location update, respecting visibility rules - find users that can see me
    public List<String> findUsersAffectedByWithVisibility(String userId, double latitude, double longitude, double radiusKm) {
        // Apply the visibility settings of the user (the one updating their location)
        String visibility = getVisibility(userId);
        if ("PRIVATE".equalsIgnoreCase(visibility)) {
            return Collections.emptyList();
        }

        Circle circle = new Circle(new Point(longitude, latitude), new Distance(radiusKm, Metrics.KILOMETERS));
        // Find all users within the radius of the user's location
        List<String> affectedUsers = Objects.requireNonNull(redisTemplate.opsForGeo()
                        .radius(GEO_KEY, circle))
                .getContent()
                .stream()
                .map(geoResult -> geoResult.getContent().getName()) // Extract user IDs
                .filter(affectedUserId -> !affectedUserId.equals(userId)) // Exclude the current user
                .collect(Collectors.toList());

        // if friends_only then filter out users that are not on my friends list
        if ("FRIENDS_ONLY".equalsIgnoreCase(visibility)) {
            List<String> friendsList = redisTemplate.opsForList().range(FRIENDS_LIST_KEY + userId, 0, -1);

            if (friendsList == null || friendsList.isEmpty()) {
                return Collections.emptyList();
            }

            return affectedUsers.stream()
                    .filter(friendsList::contains)
                    .collect(Collectors.toList());
        }

        // If PUBLIC, all affected users can see the update
        return affectedUsers;
    }

    // Find nearby users for specific user
    public List<LocationResponse> findNearbyUsersForUser(String userId) {
        Point userPoint = redisTemplate.opsForGeo()
                .position(GEO_KEY, userId)
                .stream()
                .findFirst()
                .orElse(null);

        if (userPoint == null) return Collections.emptyList();

        return findNearbyUsersWithVisibility(userId, userPoint.getY(), userPoint.getX(), 5.0); // Reuse the existing method
    }

    // Update nearby users for a specific user by removing a given user
    public String updateNearbyUsersForRemoval(String targetUserId, String endedUserId) {
        try {
            // Get the current list of nearby users for the target user
            List<LocationResponse> nearbyUsers = findNearbyUsersForUser(targetUserId);

            // Remove the user who ended their walk
            List<LocationResponse> updatedNearbyUsers = nearbyUsers.stream()
                    .filter(user -> !user.getUserId().equals(endedUserId)) // Exclude the user who ended their walk
                    .collect(Collectors.toList());

            // Convert the updated list to JSON
            return objectMapper.writeValueAsString(updatedNearbyUsers);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to update nearby users for removal of user: " + endedUserId);
            return "[]"; // Return an empty list in case of failure
        }
    }

    // Clear all data for a user's walk
    public void clearWalkData(String userId, String groupWalkId) {
        try {
            redisTemplate.opsForGeo().remove(GEO_KEY, userId);
            redisTemplate.opsForHash().delete(USER_METADATA_KEY, userId);
            redisTemplate.delete(VISIBILITY_KEY + userId);
            redisTemplate.delete(FRIENDS_LIST_KEY + userId);
            if (groupWalkId != null && !groupWalkId.isEmpty()) {
                String groupWalkKey = GROUP_WALK_LIST_KEY + groupWalkId;
                redisTemplate.opsForList().remove(groupWalkKey, 0, userId);
                System.out.println("Removed user " + userId + " from group walk " + groupWalkId);
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to clear walk data for user: " + userId);
        }
    }

    // Calculate total distance
    public int calculateTotalDistance(List<LocationResponse> locations) {
        if (locations.size() < 2) {
            return 0;
        }
        double totalDistance = 0.0;
        for (int i = 1; i < locations.size(); i++) {
            totalDistance += calculateHaversineDistance(
                    locations.get(i - 1).getLatitude(), locations.get(i - 1).getLongitude(),
                    locations.get(i).getLatitude(), locations.get(i).getLongitude()
            );
        }
        return (int) (totalDistance * 1000);
    }

    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of Earth in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}

