package com.app.petpals.controller;

import com.app.petpals.entity.User;
import com.app.petpals.payload.*;
import com.app.petpals.service.AuthenticationService;
import com.app.petpals.service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "User - Authentication")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final JwtService jwtService;

    @PostMapping("/register")
    @Operation(summary = "Register new user.")
    public ResponseEntity<User> register(@RequestBody final RegisterRequest registerRequest) throws MessagingException {
        User user = authenticationService.register(registerRequest);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    @Operation(summary = "Login to the application.")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody final AuthenticationRequest authenticationRequest) {
        User user = authenticationService.authenticate(authenticationRequest);
        String token = jwtService.generateToken(user);
        AuthenticationResponse authenticationResponse = new AuthenticationResponse(token, user.getId());
        return ResponseEntity.ok(authenticationResponse);
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify account.")
    public ResponseEntity<TextResponse> verifyUser(@RequestBody final VerifyUserRequest verifyUserRequest){
            authenticationService.verifyUser(verifyUserRequest);
            TextResponse textResponse = new TextResponse("Account verified successfully.");
            return ResponseEntity.ok(textResponse);
    }

    @PostMapping("/resend")
    @Operation(summary = "Resend verification code.")
    public ResponseEntity<TextResponse> resendVerificationCode(@RequestBody ResendRequest resendRequest) throws MessagingException {
            authenticationService.resendVerificationCode(resendRequest.getEmail());
            TextResponse textResponse = new TextResponse("Verification code resent.");
            return ResponseEntity.ok(textResponse);
    }

}