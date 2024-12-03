package com.app.petpals.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void sendMessage(String message, Principal principal) {
        String sender = principal.getName(); // Extract username from Principal
        String destination = "/topic/chat";
        messagingTemplate.convertAndSend(destination, sender + ": " + message);
    }
}
