package com.app.petpals.controller;

import com.app.petpals.entity.Dog;
import com.app.petpals.entity.User;
import com.app.petpals.payload.DogAddRequest;
import com.app.petpals.payload.DogResponse;
import com.app.petpals.service.AWSImageService;
import com.app.petpals.service.DogService;
import com.app.petpals.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dogs")
@RequiredArgsConstructor
@Tag(name = "Dogs")
public class DogController {
    private final DogService dogService;
    private final UserService userService;
    private final AWSImageService awsImageService;

    @GetMapping()
    @Operation(summary = "Get all dogs.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<DogResponse>> findAll() {
        List<Dog> dogs = dogService.getDogs();
        return ResponseEntity.ok(dogs.stream()
                .map(dog -> DogResponse.builder()
                        .id(dog.getId())
                        .name(dog.getName())
                        .description(dog.getDescription())
                        .imageUrl(Optional.ofNullable(dog.getImageId())
                                .map(awsImageService::getPresignedUrl)
                                .orElse(null))
                        .build()
                ).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get dog by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<DogResponse> findByid(@PathVariable String id) {
        Dog dog = dogService.getDogById(id);
        return ResponseEntity.ok(DogResponse.builder()
                .id(dog.getId())
                .name(dog.getName())
                .description(dog.getDescription())
                .imageUrl(Optional.ofNullable(dog.getImageId())
                        .map(awsImageService::getPresignedUrl)
                        .orElse(null))
                .build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Add dog to user.", description = "All fields except name are optional.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> addDog(@RequestPart(value = "name") String name,
                                    @RequestPart(value = "file", required = false) MultipartFile file,
                                    @RequestPart(value = "description", required = false) String description) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) authentication.getPrincipal();
        String imageId = null;
        try {
            if (file != null && !file.isEmpty()) {
                imageId = awsImageService.uploadImage(file.getBytes(), file.getContentType());
            }
            Dog dog = dogService.saveDog(authUser.getId(),
                    DogAddRequest.builder()
                            .name(name)
                            .description(description)
                            .imageId(imageId)
                            .build());

            return ResponseEntity.ok(DogResponse.builder()
                    .id(dog.getId())
                    .name(dog.getName())
                    .description(dog.getDescription())
                    .imageUrl(awsImageService.getPresignedUrl(imageId))
                    .build());

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image: " + e.getMessage());
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
