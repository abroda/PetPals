package com.app.petpals.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class GroupWalkResponse {
    private String id;
    private String title;
    private String description;
    private String location;
    private String datetime;
    private GroupWalkCreatorResponse creator;
    private List<String> tags;
    private List<GroupWalkParticipantResponse> participants;
}
