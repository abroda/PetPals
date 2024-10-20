package com.app.petpals.controller;

import com.app.petpals.payload.BlockRequest;
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
    public ResponseEntity<String> blockUser(@RequestBody BlockRequest request) {
        blockService.blockUser(request.getBlockerId(), request.getBlockedId());
        return ResponseEntity.ok("User blocked successfully.");
    }

    @PostMapping("/unblock")
    @Operation(summary = "Unblock user.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<String> unblockUser(@RequestBody BlockRequest request) {
        blockService.unblockUser(request.getBlockerId(), request.getBlockedId());
        return ResponseEntity.ok("User unblocked successfully.");
    }

    @GetMapping("/is-blocked")
    @Operation(summary = "Check if user is blocked.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Boolean> isBlocked(@RequestBody BlockRequest request) {
        boolean isBlocked = blockService.isBlocked(request.getBlockerId(), request.getBlockedId());
        return ResponseEntity.ok(isBlocked);
    }
}
