package com.app.petpals.payload.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChatErrorResponse {
    private int status;
    private String message;
    private long timestamp;
}
