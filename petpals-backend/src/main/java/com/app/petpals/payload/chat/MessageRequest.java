package com.app.petpals.payload.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {
    private String destination;
    private String chatroomId;
    private String senderId;
    private String content;
}
