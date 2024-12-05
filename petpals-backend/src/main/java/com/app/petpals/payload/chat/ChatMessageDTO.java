package com.app.petpals.payload.chat;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ChatMessageDTO {
    private String chatroomId;
    private String senderId;
    private String content;
}
