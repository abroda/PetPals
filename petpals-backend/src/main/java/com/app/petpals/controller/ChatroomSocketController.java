package com.app.petpals.controller;

import com.app.petpals.entity.ChatMessage;
import com.app.petpals.entity.User;
import com.app.petpals.payload.chat.MessageRequest;
import com.app.petpals.service.ChatroomMessageService;
import com.app.petpals.service.ChatroomService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

@Controller
public class ChatroomSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatroomMessageService chatroomMessageService;
    private final ObjectMapper objectMapper;

    public ChatroomSocketController(SimpMessagingTemplate messagingTemplate, ChatroomMessageService chatroomMessageService, ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.chatroomMessageService = chatroomMessageService;
        this.objectMapper = objectMapper;
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @MessageMapping("/chat")
    public void sendMessage(MessageRequest messageRequest) {
        String destination = "/user/chat/" + messageRequest.getChatroomId();
        System.out.println("Sending message to " + destination);
        System.out.println(messageRequest);
        ChatMessage message = chatroomMessageService.addChatroomMessage(messageRequest);
        messagingTemplate.convertAndSend(destination, chatroomMessageService.createMessageResponse(message));
    }
}
