package com.app.petpals.controller;

import com.app.petpals.entity.User;
import com.app.petpals.payload.AccountEditRequest;
import com.app.petpals.payload.AccountResponse;
import com.app.petpals.service.AWSImageService;
import com.app.petpals.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User")
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
                        .id(user.getId())
                        .email(user.getUsername())
                        .username(user.getDisplayName())
                        .description(user.getDescription())
                        .imageUrl(Optional.ofNullable(user.getProfilePictureId())
                                .map(awsImageService::getPresignedUrl)
                                .orElse(null))
                        .visibility(user.getVisibility())
                        .build()
                ).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    @Operation(summary = "Get users for testing ONLY!", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<User>> getUsersTest() {
        List<User> users = userService.getUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user account by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<AccountResponse> getUserById(@PathVariable String id) {
        User user = userService.getById(id);

        return ResponseEntity.ok(AccountResponse.builder()
                .id(user.getId())
                .email(user.getUsername())
                .username(user.getDisplayName())
                .description(user.getDescription())
                .imageUrl(Optional.ofNullable(user.getProfilePictureId())
                        .map(awsImageService::getPresignedUrl)
                        .orElse(null))
                .visibility(user.getVisibility())
                .build());
    }

    @GetMapping("/me")
    @Operation(summary = "Get user account by token - logged in users profile!", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<AccountResponse> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) auth.getPrincipal();
        return ResponseEntity.ok(AccountResponse.builder()
                .id(authUser.getId())
                .email(authUser.getUsername())
                .username(authUser.getDisplayName())
                .description(authUser.getDescription())
                .imageUrl(Optional.ofNullable(authUser.getProfilePictureId())
                        .map(awsImageService::getPresignedUrl)
                        .orElse(null))
                .visibility(authUser.getVisibility())
                .build());
    }

    @PutMapping(path = "/{id}")
    @Operation(summary = "Update user data by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<AccountResponse> updateUserData(@PathVariable String id, @RequestBody AccountEditRequest accountEditRequest) {
        User user = userService.updateUserData(id, accountEditRequest);
        return ResponseEntity.ok(AccountResponse.builder()
                .id(user.getId())
                .email(user.getUsername())
                .username(user.getDisplayName())
                .description(user.getDescription())
                .imageUrl(Optional.ofNullable(user.getProfilePictureId())
                        .map(awsImageService::getPresignedUrl)
                        .orElse(null))
                .visibility(user.getVisibility())
                .build());
    }

    @PutMapping(path = "/{id}/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update user profile picture by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<AccountResponse> updateUserProfilePicture(@PathVariable String id, @RequestParam("file") MultipartFile file) throws IOException {
        User user = userService.getById(id);
        String imageId = null;
        if (file != null && !file.isEmpty()) {
            if (user.getProfilePictureId() != null) {
                awsImageService.deleteImage(user.getProfilePictureId());
            }
            imageId = awsImageService.uploadImage(file.getBytes(), file.getContentType());
        }
        User updatedUser = userService.updateUserProfilePicture(id, imageId);
        return ResponseEntity.ok(AccountResponse.builder()
                .id(updatedUser.getId())
                .email(updatedUser.getUsername())
                .username(updatedUser.getDisplayName())
                .description(updatedUser.getDescription())
                .imageUrl(Optional.ofNullable(updatedUser.getProfilePictureId())
                        .map(awsImageService::getPresignedUrl)
                        .orElse(null))
                .visibility(user.getVisibility())
                .build());
    }

    @DeleteMapping(path = "/{id}/picture")
    @Operation(summary = "Delete user profile picture by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<AccountResponse> deleteUserProfilePicture(@PathVariable String id) {
        User user = userService.getById(id);
        if (user.getProfilePictureId() != null) {
            awsImageService.deleteImage(user.getProfilePictureId());
            user = userService.deleteUserPicture(id);
        }
        return ResponseEntity.ok(AccountResponse.builder()
                .id(user.getId())
                .email(user.getUsername())
                .username(user.getDisplayName())
                .description(user.getDescription())
                .imageUrl(Optional.ofNullable(user.getProfilePictureId())
                        .map(awsImageService::getPresignedUrl)
                        .orElse(null))
                .visibility(user.getVisibility())
                .build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<String> deleteAccount(@PathVariable String id) {
        User user = userService.getById(id);
        if (user.getProfilePictureId() != null) {
            awsImageService.deleteImage(user.getProfilePictureId());
        }
        user.getDogs().forEach(dog -> {
            if (dog.getImageId() != null) {
                awsImageService.deleteImage(dog.getImageId());
            }
        });
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully.");
    }
}
