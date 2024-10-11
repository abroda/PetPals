package com.app.petpals.controller;

import com.app.petpals.entity.Dog;
import com.app.petpals.repository.DogRepository;
import com.app.petpals.service.DogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dogs")
@RequiredArgsConstructor
@Tag(name = "Dogs")
public class DogController {
    private final DogService dogService;

    @GetMapping()
    @Operation(summary = "Get all dogs.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<Dog>> findAll() {
        List<Dog> dogs = dogService.getDogs();
        return ResponseEntity.ok(dogs);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get dog by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Dog> findByid(@PathVariable String id) {
        Dog dog = dogService.getDogById(id);
        return ResponseEntity.ok(dog);
    }

}
