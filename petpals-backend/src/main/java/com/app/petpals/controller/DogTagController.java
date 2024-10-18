package com.app.petpals.controller;

import com.app.petpals.entity.Dog;
import com.app.petpals.payload.DogResponse;
import com.app.petpals.service.DogTagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/dogtags")
@RequiredArgsConstructor
@Tag(name = "DogTags")
public class DogTagController {
    private final DogTagService dogTagService;

    @GetMapping
    @Operation(summary = "Get all dog tags.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> getAllDogTags() {
        return ResponseEntity.ok(dogTagService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get dog tag by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> getDogTagById(@PathVariable String id) {
        return ResponseEntity.ok(dogTagService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Create new dog tag.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> addDogTag(@RequestParam String tagName) {
        return ResponseEntity.ok(dogTagService.save(tagName));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Edit dog tag.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> editDogTag(@PathVariable String id, @RequestParam String tagName) {
        return ResponseEntity.ok(dogTagService.updateDogTag(id, tagName));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete dog tag by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> deleteDogTag(@PathVariable String id) {
        dogTagService.deleteDogTag(id);
        return ResponseEntity.ok("Dog tag deleted successfully.");
    }
}
