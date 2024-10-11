package com.app.petpals.controller;

import com.app.petpals.entity.User;
import com.app.petpals.payload.AccountEditRequest;
import com.app.petpals.payload.AccountResponse;
import com.app.petpals.payload.UserResponse;
import com.app.petpals.service.AWSImageService;
import com.app.petpals.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
@Tag(name = "Account")
public class AccountController {
    private final UserService userService;
    private final AWSImageService awsImageService;

    @GetMapping()
    @Operation(summary = "Get user accounts.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<AccountResponse>> getUsers() {
        List<User> users = userService.getUsers();
        List<AccountResponse> response = users
                .stream()
                .map(user -> AccountResponse.builder()
                        .email(user.getUsername())
                        .username(user.getDisplayName())
                        .description(user.getUserProfileDetails().getDescription())
                        .imageUrl(awsImageService.getPresignedUrl(user.getUserProfileDetails().getProfilePictureId()))
                        .build()
                ).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/email")
    @Operation(summary = "Get user account by email.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<AccountResponse> getUserByEmail(@RequestParam String email) {
        User user = userService.getByEmail(email);

        return ResponseEntity.ok(AccountResponse.builder()
                .email(user.getUsername())
                .username(user.getDisplayName())
                .description(user.getUserProfileDetails().getDescription())
                .imageUrl(awsImageService.getPresignedUrl(user.getUserProfileDetails().getProfilePictureId()))
                .build());
    }

    @GetMapping("/search")
    @Operation(summary = "Search for users by email or display name.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<UserResponse>> searchUsers(
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "displayName", required = false) String displayName) {

        List<UserResponse> users = userService.searchUsers(email, displayName);

        return ResponseEntity.ok(users);
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update user data.", description = "All fields are optional.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> updateUser(
            @RequestPart(value = "displayName", required = false) String displayName,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "description", required = false) String description
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) authentication.getPrincipal();
        String imageId = null;
        String imageUrl = null;
        try {
            User user = userService.getByEmail(authUser.getUsername());
            if (file != null && !file.isEmpty()) {
                if (user.getUserProfileDetails().getProfilePictureId() != null) {
                    awsImageService.deleteImage(user.getUserProfileDetails().getProfilePictureId());
                }
                imageId = awsImageService.uploadImage(file.getBytes(), file.getContentType());
            }

            AccountEditRequest request = AccountEditRequest.builder()
                    .email(authUser.getUsername())
                    .displayName(displayName)
                    .description(description)
                    .imageId(imageId)
                    .build();

            User updatedUser = userService.updateUser(request);
            if (updatedUser.getUserProfileDetails().getProfilePictureId() != null && !updatedUser.getUserProfileDetails().getProfilePictureId().isEmpty()) {
                imageUrl = awsImageService.getPresignedUrl(updatedUser.getUserProfileDetails().getProfilePictureId());
            }

            AccountResponse accountResponse = AccountResponse.builder()
                    .email(updatedUser.getUsername())
                    .username(updatedUser.getDisplayName())
                    .description(updatedUser.getUserProfileDetails().getDescription())
                    .imageUrl(imageUrl)
                    .build();

            return ResponseEntity.ok(accountResponse);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image: " + e.getMessage());
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
