package com.app.petpals.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class GroupWalkCreatorResponse {
    private String userId;
    private String username;
    private String imageUrl;
}
