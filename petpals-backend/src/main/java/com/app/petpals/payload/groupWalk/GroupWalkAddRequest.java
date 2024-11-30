package com.app.petpals.payload.groupWalk;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GroupWalkAddRequest {
    private String title;
    private String description;
    private String creatorId;
    private String datetime;
    private String locationName;
    private double latitude;
    private double longitude;
    private List<String> tags;
    private List<String> participatingDogsIds;
}
