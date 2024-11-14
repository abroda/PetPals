package com.app.petpals.payload.groupWalk;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GroupWalkParticipantDogResponse {
    private String dogId;
    private String name;
    private String imageUrl;
}
