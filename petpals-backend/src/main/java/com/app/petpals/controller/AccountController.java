package com.app.petpals.controller;

import com.app.petpals.payload.ConfirmResetPasswordCodeRequest;
import com.app.petpals.payload.CreateResetPasswordCodeRequest;
import com.app.petpals.payload.ResetPasswordRequest;
import com.app.petpals.service.UserPasswordResetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
@Tag(name = "Account")
public class AccountController {

    private final UserPasswordResetService userPasswordResetService;

    @PostMapping("/password-reset/request")
    @Operation(summary = "Generate password reset code.")
    public ResponseEntity<String> forgotPassword(@RequestBody final CreateResetPasswordCodeRequest createResetPasswordCodeRequest) {
        try {
            userPasswordResetService.forgotPassword(createResetPasswordCodeRequest);
            return ResponseEntity.ok("Password reset code sent.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/password-reset/confirm")
    @Operation(summary = "Validate provided password reset code.")
    public ResponseEntity<String> confirmResetCode(@RequestBody final ConfirmResetPasswordCodeRequest confirmResetPasswordCodeRequest) {
        try {
            userPasswordResetService.confirmResetCode(confirmResetPasswordCodeRequest);
            return ResponseEntity.ok("Code is valid.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/password-reset")
    @Operation(summary = "Reset password.")
    public ResponseEntity<String> resetPassword(@RequestBody final ResetPasswordRequest resetPasswordRequest) {
        try {
            userPasswordResetService.resetPassword(resetPasswordRequest);
            return ResponseEntity.ok("Password was reset.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
