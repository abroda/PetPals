package com.app.petpals.payload.account;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FriendshipRequestResponse {
    private String id;
    private String status;
    private String senderId;
    private String senderUsername;
    private String senderImageUrl;
    private String receiverId;
    private String receiverUsername;
    private String receiverImageUrl;

}