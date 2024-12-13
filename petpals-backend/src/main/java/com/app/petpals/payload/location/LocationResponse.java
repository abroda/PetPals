package com.app.petpals.payload.location;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LocationResponse {
    private String userId;
    private double latitude;
    private double longitude;
    private LocalDateTime timestamp;
    private String imageUrl;
}
