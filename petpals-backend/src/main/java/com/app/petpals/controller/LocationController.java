//package com.app.petpals.controller;
//
//import com.app.petpals.payload.location.LocationMessage;
//import com.app.petpals.payload.location.NotificationMessage;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//
//import java.security.Principal;
//import java.util.ArrayList;
//import java.util.List;
//
//@Controller
//public class LocationController {
//
//    private final SimpMessagingTemplate messagingTemplate;
//    private final List<LocationMessage> userLocations = new ArrayList<>(); // Store user locations
//
//    public LocationController(SimpMessagingTemplate messagingTemplate) {
//        this.messagingTemplate = messagingTemplate;
//    }
//
//    /**
//     * Handles incoming location updates from the client.
//     * Maps to "/app/location" due to the application destination prefix "/app".
//     */
//    @MessageMapping("/location")
//    public void handleLocationUpdate(LocationMessage locationMessage, Principal principal) {
//        double radius = 5.0; // radius in kilometers
//        System.out.println("Principal: " + principal);
//        List<NotificationMessage> nearbyUsers = new ArrayList<>();
//
//        for (LocationMessage existingUser : userLocations) {
//            double distance = calculateDistance(
//                    locationMessage.getLatitude(), locationMessage.getLongitude(),
//                    existingUser.getLatitude(), existingUser.getLongitude()
//            );
//
//            if (distance <= radius) {
//                NotificationMessage notification = new NotificationMessage();
//                notification.setUserId(existingUser.getUserId());
//                notification.setLatitude(existingUser.getLatitude());
//                notification.setLongitude(existingUser.getLongitude());
//                notification.setDistance(distance);
//                nearbyUsers.add(notification);
//            }
//        }
////        messagingTemplate.convertAndSend("/location/nearby", nearbyUsers);
//        messagingTemplate.convertAndSendToUser(
//                locationMessage.getUserId(),
//                "/location/nearby",
//                nearbyUsers
//        );
//
//
//        // Update the user's location
//        userLocations.removeIf(user -> user.getUserId().equals(locationMessage.getUserId()));
//        userLocations.add(locationMessage);
//    }
//
//    /**
//     * Calculates the distance in kilometers between two geographical points using the Haversine formula.
//     */
//    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
//        double R = 6371; // Earth radius in km
//        double dLat = Math.toRadians(lat2 - lat1);
//        double dLon = Math.toRadians(lon2 - lon1);
//        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
//                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
//        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//        return R * c; // Distance in km
//    }
//}
