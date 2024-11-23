package com.app.petpals.service;

import com.app.petpals.payload.location.LocationResponse;
import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class RedisLocationService {

    private static final String GEO_KEY = "user_locations";

    private final StringRedisTemplate redisTemplate;

    public RedisLocationService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // Add or update a user's location
    public void updateLocation(String userId, double latitude, double longitude, LocalDateTime timestamp) {
        redisTemplate.opsForGeo().add(GEO_KEY, new RedisGeoCommands.GeoLocation<>(userId, new Point(longitude, latitude)));
        redisTemplate.opsForHash().put("user_metadata", userId, timestamp.toString());
        System.out.println("Updated location for user: " + userId);
    }

    // Find nearby users within a radius (in km)
    public List<LocationResponse> findNearbyUsers(double latitude, double longitude, double radiusKm) {
        Circle circle = new Circle(new Point(longitude, latitude), new Distance(radiusKm, Metrics.KILOMETERS));

        return Objects.requireNonNull(redisTemplate.opsForGeo()
                        .radius(
                                GEO_KEY,
                                circle
                        ))
                .getContent()
                .stream()
                .map(geoResult -> {
                    String userId = geoResult.getContent().getName();
                    Point point = Objects.requireNonNull(redisTemplate.opsForGeo().position(GEO_KEY, userId)).get(0);
                    String timestampStr = (String) redisTemplate.opsForHash().get("user_metadata", userId);
                    LocalDateTime timestamp = timestampStr != null ? LocalDateTime.parse(timestampStr) : null;
                    return new LocationResponse(userId, point.getY(), point.getX(), timestamp);
                })
                .collect(Collectors.toList());
    }

    // Remove a user's location (e.g., on disconnection)
    public void removeLocation(String userId) {
        redisTemplate.opsForGeo().remove(GEO_KEY, userId);
        System.out.println("Removed location for user: " + userId);
    }
}
