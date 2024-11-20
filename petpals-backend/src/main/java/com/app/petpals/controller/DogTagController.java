package com.app.petpals.controller;

import com.app.petpals.service.DogTagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dogtags")
@RequiredArgsConstructor
@Tag(name = "DogTags")
public class DogTagController {
    private final DogTagService dogTagService;

    @GetMapping
    @Operation(summary = "Get all dog tags grouped by category.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> getAllDogTags() {
        return ResponseEntity.ok(dogTagService.findAllGroupedByCategory());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get dog tag by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> getDogTagById(@PathVariable String id) {
        return ResponseEntity.ok(dogTagService.findById(id));
    }
}
