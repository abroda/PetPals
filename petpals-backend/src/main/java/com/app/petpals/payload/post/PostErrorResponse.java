package com.app.petpals.payload.post;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PostErrorResponse {
    private int status;
    private String message;
    private long timestamp;
}
