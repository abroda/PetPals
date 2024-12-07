package com.app.petpals.controller;

import com.app.petpals.entity.ChatMessage;
import com.app.petpals.payload.chat.MessageRequest;
import com.app.petpals.payload.chat.MessageResponse;
import com.app.petpals.service.ChatroomMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chatroom")
@RequiredArgsConstructor
@Tag(name = "Chatroom")
public class ChatroomMessageController {

    private final ChatroomMessageService chatroomMessageService;

    @GetMapping("/{chatroomId}/messages")
    @Operation(summary = "Get all messages for a chatroom.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<MessageResponse>> getChatroomMessages(@PathVariable("chatroomId") String chatroomId) {
        List<ChatMessage> chatMessages = chatroomMessageService.getChatroomMessagesByChatroomId(chatroomId);
        return ResponseEntity.ok(chatMessages.stream()
                .map(chatroomMessageService::createMessageResponse)
                .collect(Collectors.toList()));
    }

    @PostMapping("/messages")
    @Operation(summary = "Add new message to chatroom.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MessageResponse> addChatroomMessage(@RequestBody MessageRequest request) {
        ChatMessage message = chatroomMessageService.addChatroomMessage(request);
        return ResponseEntity.ok(chatroomMessageService.createMessageResponse(message));
    }
}
