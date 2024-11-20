package com.app.petpals.controller;

import com.app.petpals.entity.Dog;
import com.app.petpals.entity.User;
import com.app.petpals.payload.dog.DogAddRequest;
import com.app.petpals.payload.dog.DogResponse;
import com.app.petpals.service.AWSImageService;
import com.app.petpals.service.DogService;
import com.app.petpals.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User - Dogs")
public class UserDogsController {
    private final UserService userService;
    private final DogService dogService;
    private final AWSImageService awsImageService;

    @GetMapping("/{id}/dogs")
    @Operation(summary = "Get dogs for user by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<DogResponse>> getUserDogs(@PathVariable String id) {
        User user = userService.getById(id);
        List<Dog> dogs = dogService.getDogsByUser(user);
        return ResponseEntity.ok(dogs.stream()
                .map(dogService::createDogResponse)
                .collect(Collectors.toList()));
    }

    @PostMapping("/{id}/dogs")
    @Operation(summary = "Add dog to the user.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<DogResponse> addDogToUser(@PathVariable String id, @RequestBody DogAddRequest request) {
        Dog dog = dogService.saveDog(id, request);
        return ResponseEntity.ok(dogService.createDogResponse(dog));
    }
}
