package com.app.petpals.controller;

import com.app.petpals.payload.chat.MessageRequest;
import com.app.petpals.service.ChatroomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatroomSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatroomService chatroomService;

    @MessageMapping("/chat")
    public void sendMessage(MessageRequest messageDTO) {
        chatroomService.saveMessage(messageDTO);
        String destination = "/topic/chat/" + messageDTO.getChatroomId();
        messagingTemplate.convertAndSend(destination, messageDTO);
    }

//    @MessageMapping("/chat") // Maps to "/app/chat"
//    public void handleChatMessage(ChatMessageDTO messageDTO) {
//        Chatroom chatroom = chatroomService.getOrCreateChatroom(messageDTO.getSenderId(), messageDTO.getRecipientId());
//        messageDTO.setChatroomId(chatroom.getId().toString());
//        chatroomService.saveMessage(messageDTO);
//
//        messagingTemplate.convertAndSend("/topic/chatroom/" + chatroom.getId(), messageDTO
//        );
//    }
}
