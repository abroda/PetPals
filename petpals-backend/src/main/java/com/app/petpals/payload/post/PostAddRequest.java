package com.app.petpals.payload.post;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostAddRequest {
    private String title;
    private String description;
    private String userId;
}
