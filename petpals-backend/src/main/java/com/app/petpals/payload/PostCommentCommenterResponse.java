package com.app.petpals.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PostCommentCommenterResponse {
    private String userId;
    private String username;
    private String imageUrl;
}
