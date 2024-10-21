package com.app.petpals.controller;

import com.app.petpals.entity.User;
import com.app.petpals.payload.AuthenticationRequest;
import com.app.petpals.payload.AuthenticationResponse;
import com.app.petpals.payload.RegisterRequest;
import com.app.petpals.payload.VerifyUserRequest;
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
    public ResponseEntity<?> verifyUser(@RequestBody final VerifyUserRequest verifyUserRequest){
            authenticationService.verifyUser(verifyUserRequest);
            return ResponseEntity.ok("Account verified successfully.");
    }

    @PostMapping("/resend")
    @Operation(summary = "Resend verification code.")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email) throws MessagingException {
            authenticationService.resendVerificationCode(email);
            return ResponseEntity.ok("Verification code resent.");
    }

}