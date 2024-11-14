package com.app.petpals.payload.groupWalk;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class GroupWalkParticipantResponse {
    private String userId;
    private String username;
    private String imageUrl;
    private List<GroupWalkParticipantDogResponse> dogs;
}
