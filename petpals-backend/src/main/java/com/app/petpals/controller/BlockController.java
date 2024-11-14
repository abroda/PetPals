package com.app.petpals.controller;

import com.app.petpals.payload.account.BlockRequest;
import com.app.petpals.payload.BooleanResponse;
import com.app.petpals.payload.TextResponse;
import com.app.petpals.service.BlockService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User - Block")
public class BlockController {
    private final BlockService blockService;

    @PostMapping("/block")
    @Operation(summary = "Block user.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<TextResponse> blockUser(@RequestBody BlockRequest request) {
        blockService.blockUser(request.getBlockerId(), request.getBlockedId());
        TextResponse textResponse = new TextResponse("User blocked successfully.");
        return ResponseEntity.ok(textResponse);
    }

    @PostMapping("/unblock")
    @Operation(summary = "Unblock user.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<TextResponse> unblockUser(@RequestBody BlockRequest request) {
        blockService.unblockUser(request.getBlockerId(), request.getBlockedId());
        TextResponse textResponse = new TextResponse("User unblocked successfully.");
        return ResponseEntity.ok(textResponse);
    }

    @GetMapping("/is-blocked")
    @Operation(summary = "Check if user is blocked.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<BooleanResponse> isBlocked(@RequestBody BlockRequest request) {
        boolean isBlocked = blockService.isBlocked(request.getBlockerId(), request.getBlockedId());
        BooleanResponse booleanResponse = new BooleanResponse(isBlocked);
        return ResponseEntity.ok(booleanResponse);
    }
}
