package com.app.petpals.controller;

import com.app.petpals.entity.User;
import com.app.petpals.payload.chat.ChatroomIdsResponse;
import com.app.petpals.payload.chat.ChatroomResponse;
import com.app.petpals.payload.chat.CreateChatroomRequest;
import com.app.petpals.service.ChatroomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatroom")
@Tag(name = "Chatroom")
public class ChatroomController {

    private final ChatroomService chatroomService;

    @GetMapping()
    @Operation(summary = "Get all chatrooms for user - gets id from token.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<ChatroomResponse>> getAllChatrooms() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) auth.getPrincipal();
        return ResponseEntity.ok(chatroomService.getAllChatroomsForUser(authUser.getId()));
    }

    @PostMapping()
    @Operation(summary = "Create a new chat. If chat exists for provided users returned chatroom id will be of the existing chat. userIds should contain all users - including user who requests the chatroom creation", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ChatroomResponse> createChatroom(@RequestBody CreateChatroomRequest request) {
        ChatroomResponse response = chatroomService.getOrCreateChatroom(request.getUserIds());
        return ResponseEntity.ok(response);
    }
}
