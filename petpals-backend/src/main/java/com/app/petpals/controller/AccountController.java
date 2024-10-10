package com.app.petpals.controller;

import com.app.petpals.entity.User;
import com.app.petpals.payload.AccountEditRequest;
import com.app.petpals.payload.AccountResponse;
import com.app.petpals.payload.UserResponse;
import com.app.petpals.service.UserService;
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
@RequestMapping("/api/account")
@RequiredArgsConstructor
@Tag(name = "Account")
public class AccountController {
    private final UserService userService;

    @GetMapping()
    @Operation(summary = "Get user accounts.",  security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<UserResponse>> getUsers() {
        List<UserResponse> users = userService.getUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/email")
    @Operation(summary = "Get user account by email.",  security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<UserResponse> getUserByEmail(@RequestParam String email) {
        UserResponse userResponse = userService.getByEmail(email);
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/search")
    @Operation(summary = "Search for users by email or display name.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<UserResponse>> searchUsers(
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "displayName", required = false) String displayName) {

        List<UserResponse> users = userService.searchUsers(email, displayName);

        return ResponseEntity.ok(users);
    }

    @PutMapping()
    @Operation(summary = "Update user data.", description = "All fields are optional.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<AccountResponse> updateUser(@RequestBody AccountEditRequest request){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) authentication.getPrincipal();
        AccountResponse response = userService.updateUser(authUser.getUsername(), request);
        return ResponseEntity.ok(response);
    }

//    public void updateProfilePicture(){
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        User authUser = (User) authentication.getPrincipal();
////        User user = userService.getByEmail(authUser.getUsername());
//    }
}
