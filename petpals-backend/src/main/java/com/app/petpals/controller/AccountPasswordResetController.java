package com.app.petpals.controller;

import com.app.petpals.payload.auth.ConfirmResetPasswordCodeRequest;
import com.app.petpals.payload.auth.CreateResetPasswordCodeRequest;
import com.app.petpals.payload.account.ResetPasswordRequest;
import com.app.petpals.payload.TextResponse;
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
    public ResponseEntity<TextResponse> forgotPassword(@RequestBody final CreateResetPasswordCodeRequest createResetPasswordCodeRequest) throws MessagingException {
        userPasswordResetService.forgotPassword(createResetPasswordCodeRequest);
        TextResponse textResponse = new TextResponse("Password reset code sent.");
        return ResponseEntity.ok(textResponse);
    }

    @PostMapping("/confirm")
    @Operation(summary = "Validate provided password reset code.")
    public ResponseEntity<TextResponse> confirmResetCode(@RequestBody final ConfirmResetPasswordCodeRequest confirmResetPasswordCodeRequest) {
        userPasswordResetService.confirmResetCode(confirmResetPasswordCodeRequest);
        TextResponse textResponse = new TextResponse("Code is valid.");
        return ResponseEntity.ok(textResponse);
    }

    @PostMapping()
    @Operation(summary = "Reset password.")
    public ResponseEntity<TextResponse> resetPassword(@RequestBody final ResetPasswordRequest resetPasswordRequest) {
        userPasswordResetService.resetPassword(resetPasswordRequest);
        TextResponse textResponse = new TextResponse("Password was reset.");
        return ResponseEntity.ok(textResponse);
    }
}
