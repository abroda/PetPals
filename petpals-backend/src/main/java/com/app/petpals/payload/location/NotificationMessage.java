package com.app.petpals.payload.location;

import lombok.Data;

@Data
public class NotificationMessage {
    private String userId;
    private double latitude;
    private double longitude;
    private double distance;
}

