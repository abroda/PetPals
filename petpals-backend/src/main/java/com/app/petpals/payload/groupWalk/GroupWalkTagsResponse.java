package com.app.petpals.payload.groupWalk;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class GroupWalkTagsResponse {
    private List<String> tags;
}
