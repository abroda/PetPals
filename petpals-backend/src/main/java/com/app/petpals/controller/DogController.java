package com.app.petpals.controller;

import com.app.petpals.entity.Dog;
import com.app.petpals.payload.DogEditRequest;
import com.app.petpals.payload.DogResponse;
import com.app.petpals.service.AWSImageService;
import com.app.petpals.service.DogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dogs")
@RequiredArgsConstructor
@Tag(name = "Dog - General")
public class DogController {
    private final DogService dogService;
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
                        .tags(dog.getTags())
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
                .tags(dog.getTags())
                .build());
    }

    @GetMapping("/tags/{id}")
    @Operation(summary = "Get dogs by tag id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<DogResponse>> getDogsByTagId(@PathVariable String id){
        List<Dog> dogs = dogService.getDogsByTagId(id);
        return ResponseEntity.ok(dogs.stream()
                .map(dog -> DogResponse.builder()
                        .id(dog.getId())
                        .name(dog.getName())
                        .description(dog.getDescription())
                        .imageUrl(Optional.ofNullable(dog.getImageId())
                                .map(awsImageService::getPresignedUrl)
                                .orElse(null))
                        .tags(dog.getTags())
                        .build()
                ).collect(Collectors.toList()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Edit dog data by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<DogResponse> editDogData(@PathVariable String id, @RequestBody DogEditRequest request) {
        Dog dog = dogService.updateDog(id, request);
        return ResponseEntity.ok(DogResponse.builder()
                .id(dog.getId())
                .name(dog.getName())
                .description(dog.getDescription())
                .imageUrl(Optional.ofNullable(dog.getImageId())
                        .map(awsImageService::getPresignedUrl)
                        .orElse(null))
                .tags(dog.getTags())
                .build());
    }

    @PutMapping(value = "/{id}/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Edit dog picture by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<DogResponse> editDogPicture(@PathVariable String id, @RequestParam MultipartFile file) throws IOException {
        Dog dog = dogService.getDogById(id);
        String imageId = null;
        if (file != null && !file.isEmpty()) {
            if (dog.getImageId() != null) {
                awsImageService.deleteImage(dog.getImageId());
            }
            imageId = awsImageService.uploadImage(file.getBytes(), file.getContentType());
        }
        dog = dogService.updateDogPicture(id, imageId);
        return ResponseEntity.ok(DogResponse.builder()
                .id(dog.getId())
                .name(dog.getName())
                .description(dog.getDescription())
                .imageUrl(Optional.ofNullable(dog.getImageId())
                        .map(awsImageService::getPresignedUrl)
                        .orElse(null))
                .tags(dog.getTags())
                .build());
    }

    @DeleteMapping("/{id}/picture")
    @Operation(summary = "Remove dog picture by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<DogResponse> removeDogPicture(@PathVariable String id) {
        Dog dog = dogService.getDogById(id);
        if (dog.getImageId() != null) {
            awsImageService.deleteImage(dog.getImageId());
            dog = dogService.deleteDogPicture(id);
        }
        return ResponseEntity.ok(DogResponse.builder()
                .id(dog.getId())
                .name(dog.getName())
                .description(dog.getDescription())
                .imageUrl(Optional.ofNullable(dog.getImageId())
                        .map(awsImageService::getPresignedUrl)
                        .orElse(null))
                .tags(dog.getTags())
                .build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete dog.", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<?> deleteDog(@PathVariable String id) {
        Dog dog = dogService.getDogById(id);
        if (dog.getImageId() != null && !dog.getImageId().isEmpty()) {
            awsImageService.deleteImage(dog.getImageId());
        }
        dogService.deleteDog(id);
        return ResponseEntity.ok("Dog deleted successfully.");
    }
}
