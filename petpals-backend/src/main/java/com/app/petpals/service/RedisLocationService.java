package com.app.petpals.service;

import com.app.petpals.payload.location.LocationResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RedisLocationService {

    private static final String GEO_KEY = "user_locations";
    private static final String USER_METADATA_KEY = "user_metadata";
    private static final String LOCATION_HISTORY_KEY_PREFIX = "location_history:";

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    // Initialize walk metadata in Redis
    public void initWalk(String userId) {
        try {
            // Clear old location history
            redisTemplate.delete(LOCATION_HISTORY_KEY_PREFIX + userId);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to initialize walk metadata for user: " + userId);
        }
    }

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

            // Append to location history
            Map<String, Object> location = Map.of(
                    "latitude", latitude,
                    "longitude", longitude,
                    "timestamp", timestamp.toString()
            );
            redisTemplate.opsForList().rightPush(LOCATION_HISTORY_KEY_PREFIX + userId, objectMapper.writeValueAsString(location));
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to update location for user: " + userId);
        }
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

    // Find users affected by location update
    public List<String> findUsersAffectedBy(String userId, double latitude, double longitude, double radiusKm) {
        Circle circle = new Circle(new Point(longitude, latitude), new Distance(radiusKm, Metrics.KILOMETERS));

        // Find all users within the radius of this user's location
        return Objects.requireNonNull(redisTemplate.opsForGeo()
                        .radius(GEO_KEY, circle)) // Redis geospatial query
                .getContent()
                .stream()
                .map(geoResult -> geoResult.getContent().getName()) // Extract user IDs
                .filter(affectedUserId -> !affectedUserId.equals(userId)) // Exclude the current user
                .collect(Collectors.toList());
    }

    // Find nearby users for specific user
    public List<LocationResponse> findNearbyUsersForUser(String userId) {
        Point userPoint = redisTemplate.opsForGeo()
                .position(GEO_KEY, userId)
                .stream()
                .findFirst()
                .orElse(null);

        if (userPoint == null) return Collections.emptyList();

        return findNearbyUsers(userPoint.getY(), userPoint.getX(), 5.0); // Reuse the existing method
    }

    // Get location history
    public List<LocationResponse> getLocationHistory(String userId) {
        try {
            List<String> locationJsons = redisTemplate.opsForList().range(LOCATION_HISTORY_KEY_PREFIX + userId, 0, -1);
            if (locationJsons == null || locationJsons.isEmpty()) {
                return Collections.emptyList();
            }
            return locationJsons.stream()
                    .map(json -> {
                        try {
                            Map<String, Object> location = objectMapper.readValue(json, Map.class);
                            return new LocationResponse(
                                    userId,
                                    (double) location.get("latitude"),
                                    (double) location.get("longitude"),
                                    LocalDateTime.parse((String) location.get("timestamp"))
                            );
                        } catch (Exception e) {
                            e.printStackTrace();
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to retrieve location history for user: " + userId);
            return Collections.emptyList();
        }
    }

    // Remove all data for a user's walk
    public void clearWalkData(String userId) {
        try {
            redisTemplate.opsForGeo().remove(GEO_KEY, userId);
            redisTemplate.opsForHash().delete(USER_METADATA_KEY, userId);
            redisTemplate.delete(LOCATION_HISTORY_KEY_PREFIX + userId);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to clear walk data for user: " + userId);
        }
    }

    // Calculate total distance
    public double calculateTotalDistance(List<LocationResponse> locations) {
        if (locations.size() < 2) {
            return 0.0;
        }
        double totalDistance = 0.0;
        for (int i = 1; i < locations.size(); i++) {
            totalDistance += calculateHaversineDistance(
                    locations.get(i - 1).getLatitude(), locations.get(i - 1).getLongitude(),
                    locations.get(i).getLatitude(), locations.get(i).getLongitude()
            );
        }
        return totalDistance;
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

