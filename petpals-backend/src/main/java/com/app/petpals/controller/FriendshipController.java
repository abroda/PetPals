package com.app.petpals.controller;

import com.app.petpals.payload.FriendshipDeleteRequest;
import com.app.petpals.payload.FriendshipRequest;
import com.app.petpals.service.FriendshipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/friendships")
@Tag(name = "Friendship")
public class FriendshipController {

    private final FriendshipService friendshipService;

    @PostMapping("/request")
    @Operation(summary = "Send friends request.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<String> sendFriendRequest(@RequestBody FriendshipRequest request) {
        friendshipService.sendFriendRequest(request.getSenderId(), request.getReceiverId());
        return ResponseEntity.ok("Friend request sent.");
    }

    @PostMapping("/accept/{requestId}")
    @Operation(summary = "Accept friends request.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<String> acceptFriendRequest(@PathVariable String requestId) {
        friendshipService.acceptFriendRequest(requestId);
        return ResponseEntity.ok("Friend request accepted.");
    }

    @PostMapping("/deny/{requestId}")
    @Operation(summary = "Deny friends request.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<String> denyFriendRequest(@PathVariable String requestId) {
        friendshipService.denyFriendRequest(requestId);
        return ResponseEntity.ok("Friend request denied.");
    }

    @DeleteMapping("/remove")
    @Operation(summary = "Remove friend.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<String> removeFriend(@RequestBody FriendshipDeleteRequest request) {
        friendshipService.removeFriend(request.getUserId(), request.getFriendId());
        return ResponseEntity.ok("Friend removed.");
    }
}