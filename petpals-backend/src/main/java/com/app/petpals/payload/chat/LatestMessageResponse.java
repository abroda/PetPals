package com.app.petpals.payload.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LatestMessageResponse {
    private String chatroomId;
    private MessageResponse latestMessage;
}
