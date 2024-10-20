package com.app.petpals.controller;

import com.app.petpals.payload.ConfirmResetPasswordCodeRequest;
import com.app.petpals.payload.CreateResetPasswordCodeRequest;
import com.app.petpals.payload.ResetPasswordRequest;
import com.app.petpals.service.UserPasswordResetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account/password-reset")
@RequiredArgsConstructor
@Tag(name = "User - Password Reset")
public class AccountPasswordResetController {

    private final UserPasswordResetService userPasswordResetService;

    @PostMapping("/request")
    @Operation(summary = "Generate password reset code.")
    public ResponseEntity<String> forgotPassword(@RequestBody final CreateResetPasswordCodeRequest createResetPasswordCodeRequest) throws MessagingException {
        userPasswordResetService.forgotPassword(createResetPasswordCodeRequest);
        return ResponseEntity.ok("Password reset code sent.");
    }

    @PostMapping("/confirm")
    @Operation(summary = "Validate provided password reset code.")
    public ResponseEntity<String> confirmResetCode(@RequestBody final ConfirmResetPasswordCodeRequest confirmResetPasswordCodeRequest) {
        userPasswordResetService.confirmResetCode(confirmResetPasswordCodeRequest);
        return ResponseEntity.ok("Code is valid.");
    }

    @PostMapping()
    @Operation(summary = "Reset password.")
    public ResponseEntity<String> resetPassword(@RequestBody final ResetPasswordRequest resetPasswordRequest) {
        userPasswordResetService.resetPassword(resetPasswordRequest);
        return ResponseEntity.ok("Password was reset.");
    }
}
