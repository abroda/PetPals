package com.app.petpals.payload.groupWalk;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GroupWalkErrorResponse {
    private int status;
    private String message;
    private long timestamp;
}