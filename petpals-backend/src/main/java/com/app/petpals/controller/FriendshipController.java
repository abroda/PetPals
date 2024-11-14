package com.app.petpals.controller;

import com.app.petpals.entity.User;
import com.app.petpals.payload.account.AccountResponse;
import com.app.petpals.payload.account.FriendshipDeleteRequest;
import com.app.petpals.payload.account.FriendshipRequest;
import com.app.petpals.payload.TextResponse;
import com.app.petpals.service.AWSImageService;
import com.app.petpals.service.FriendshipService;
import com.app.petpals.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
@Tag(name = "User - Friendship")
public class FriendshipController {
    private final UserService userService;
    private final AWSImageService awsImageService;
    private final FriendshipService friendshipService;

    @GetMapping("/{id}/friends")
    @Operation(summary = "Get friends for user by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<AccountResponse>> getFriendsById(@PathVariable String id) {
        User user = userService.getById(id);
        List<AccountResponse> response = user.getFriends()
                .stream()
                .map(friend -> AccountResponse.builder()
                        .id(friend.getId())
                        .username(friend.getDisplayName())
                        .description(friend.getDescription())
                        .imageUrl(Optional.ofNullable(friend.getProfilePictureId())
                                .map(awsImageService::getPresignedUrl)
                                .orElse(null))
                        .visibility(friend.getVisibility())
                        .build()
                ).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/friends/request")
    @Operation(summary = "Send friends request.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<TextResponse> sendFriendRequest(@RequestBody FriendshipRequest request) {
        friendshipService.sendFriendRequest(request.getSenderId(), request.getReceiverId());
        return ResponseEntity.ok(new TextResponse("Friend request sent."));
    }

    @PostMapping("/friends/accept/{requestId}")
    @Operation(summary = "Accept friends request.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<TextResponse> acceptFriendRequest(@PathVariable String requestId) {
        friendshipService.acceptFriendRequest(requestId);
        return ResponseEntity.ok(new TextResponse("Friend request accepted."));
    }

    @PostMapping("/friends/deny/{requestId}")
    @Operation(summary = "Deny friends request.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<TextResponse> denyFriendRequest(@PathVariable String requestId) {
        friendshipService.denyFriendRequest(requestId);
        return ResponseEntity.ok(new TextResponse("Friend request denied."));
    }

    @DeleteMapping("/remove")
    @Operation(summary = "Remove friend.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<TextResponse> removeFriend(@RequestBody FriendshipDeleteRequest request) {
        friendshipService.removeFriend(request.getUserId(), request.getFriendId());
        return ResponseEntity.ok(new TextResponse("Friend removed."));
    }
}