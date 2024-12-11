package com.app.petpals.controller;

import com.app.petpals.entity.Friendship;
import com.app.petpals.entity.User;
import com.app.petpals.payload.BooleanResponse;
import com.app.petpals.payload.account.AccountResponse;
import com.app.petpals.payload.account.FriendshipDeleteRequest;
import com.app.petpals.payload.account.FriendshipRequest;
import com.app.petpals.payload.account.FriendshipRequestResponse;
import com.app.petpals.payload.TextResponse;
import com.app.petpals.service.AWSImageService;
import com.app.petpals.service.FriendshipService;
import com.app.petpals.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @GetMapping("/friends/{friendId}")
    @Operation(summary = "Check if you are friends together.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<BooleanResponse> checkIfFriends(@PathVariable("friendId") String friendId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) auth.getPrincipal();
        return ResponseEntity.ok(BooleanResponse.builder().response(friendshipService.checkIfUsersAreFriends(authUser.getId(), friendId)).build());
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

    @DeleteMapping("/friends/request/{requestId}")
    @Operation(
            summary = "Remove a pending friend request.",
            description = "Deletes a friend request if it is still pending.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Friend request successfully removed."),
            @ApiResponse(responseCode = "404", description = "Friend request not found or not pending."),
            @ApiResponse(responseCode = "401", description = "Unauthorized.")
    })
    public ResponseEntity<TextResponse> removePendingFriendRequest(@PathVariable String requestId) {
        friendshipService.removePendingFriendRequest(requestId);
        return ResponseEntity.ok(new TextResponse("Friend request removed."));
    }

    @DeleteMapping("/remove")
    @Operation(summary = "Remove friend.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<TextResponse> removeFriend(@RequestBody FriendshipDeleteRequest request) {
        friendshipService.removeFriend(request.getUserId(), request.getFriendId());
        return ResponseEntity.ok(new TextResponse("Friend removed."));
    }


    @GetMapping("/{id}/friends/requests")
    @Operation(
            summary = "Get friendship requests for a user",
            description = "Retrieves all friendship requests where the user is either the sender or the receiver.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved friendship requests."),
            @ApiResponse(responseCode = "404", description = "User not found."),
            @ApiResponse(responseCode = "401", description = "Unauthorized.")
    })
    public ResponseEntity<List<FriendshipRequestResponse>> getFriendRequestsForUser(@PathVariable String id) {
        List<Friendship> requests = friendshipService.getFriendRequestsForUser(id);

        // Map Friendship entities to FriendshipRequestResponse DTOs
        List<FriendshipRequestResponse> response = requests.stream()
                .map(request -> FriendshipRequestResponse.builder()
                        .id(request.getId())
                        .status(request.getStatus().name())
                        .senderId(request.getSender().getId())
                        .senderUsername(request.getSender().getDisplayName())
                        .senderImageUrl(Optional.ofNullable(request.getSender().getProfilePictureId())
                                .map(awsImageService::getPresignedUrl)
                                .orElse(null))
                        .receiverId(request.getReceiver().getId())
                        .receiverUsername(request.getReceiver().getDisplayName())
                        .receiverImageUrl(Optional.ofNullable(request.getReceiver().getProfilePictureId())
                                .map(awsImageService::getPresignedUrl)
                                .orElse(null))
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}