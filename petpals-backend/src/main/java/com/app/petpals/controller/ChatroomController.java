package com.app.petpals.controller;

import com.app.petpals.entity.Chatroom;
import com.app.petpals.payload.chat.ChatroomResponse;
import com.app.petpals.payload.chat.CreateChatroomRequest;
import com.app.petpals.service.ChatroomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatroom")
@Tag(name = "Chatroom")
public class ChatroomController {

    private final ChatroomService chatroomService;

    @PostMapping()
    @Operation(summary = "Create a new chat. If chat exists for provided users returned chatroom id will be of the existing chat. userIds should contain all users - including user who requests the chatroom creation", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ChatroomResponse> createChatroom(@RequestBody CreateChatroomRequest request) {
        ChatroomResponse response = chatroomService.getOrCreateChatroom(request.getUserIds());
        return ResponseEntity.ok(response);
    }
}
