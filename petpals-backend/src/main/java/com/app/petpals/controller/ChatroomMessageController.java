package com.app.petpals.controller;

import com.app.petpals.entity.ChatMessage;
import com.app.petpals.payload.chat.LatestMessageResponse;
import com.app.petpals.payload.chat.MessageRequest;
import com.app.petpals.payload.chat.MessageResponse;
import com.app.petpals.service.ChatroomMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @GetMapping("/{chatroomId}/messages/test")
    @Operation(summary = "Get all messages for a chatroom. - TEST ONLY (NOT PAGINATED)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<MessageResponse>> getChatroomMessagesTest(@PathVariable("chatroomId") String chatroomId) {
        List<ChatMessage> chatMessages = chatroomMessageService.getChatroomMessagesByChatroomId(chatroomId);
        return ResponseEntity.ok(chatMessages.stream()
                .map(chatroomMessageService::createMessageResponse)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{chatroomId}/messages")
    @Operation(summary = "Get all messages for a chatroom.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Page<MessageResponse>> getChatroomMessages(@PathVariable("chatroomId") String chatroomId, Pageable pageable) {
        Page<ChatMessage> chatMessages = chatroomMessageService.getChatroomMessagesByChatroomId(chatroomId, pageable);
        Page<MessageResponse> messageResponses = chatMessages.map(chatroomMessageService::createMessageResponse);
        return ResponseEntity.ok(messageResponses);
    }

    @GetMapping("/messages/latest")
    @Operation(summary = "Get all messages for chatrooms.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<LatestMessageResponse>> getLatestChatroomMessages(@RequestParam List<String> chatroomIds) {
        List<LatestMessageResponse> messages = chatroomMessageService.getLatestChatroomMessages(chatroomIds);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/messages")
    @Operation(summary = "Add new message to chatroom.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MessageResponse> addChatroomMessage(@RequestBody MessageRequest request) {
        ChatMessage message = chatroomMessageService.addChatroomMessage(request);
        return ResponseEntity.ok(chatroomMessageService.createMessageResponse(message));
    }
}
