package com.app.petpals.payload.location;

import lombok.Data;

@Data
public class LocationMessage {
    private String userId;
    private double latitude;
    private double longitude;
}

