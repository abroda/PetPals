package com.app.petpals.controller;

import com.app.petpals.service.AWSImageService;
import com.app.petpals.service.ImageService;
import com.app.petpals.service.ImageServiceFactory;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/images")
@Tag(name = "Images")
public class ImageController {

    private final ImageServiceFactory imageServiceFactory;
    private final AWSImageService aWSImageService;

    @GetMapping(value = "/{id}", produces = "image/jpeg")
    @Operation(summary = "Get image by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<byte[]> getImage(@PathVariable String id) {
        try {
            ImageService imageService = imageServiceFactory.getImageService();
            byte[] imageData = imageService.getImage(id);
            return ResponseEntity.ok(imageData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image (jpeg, png, gif or webp).", security = @SecurityRequirement(name = "bearerAuth"),
            requestBody = @RequestBody(content = @Content(
                    mediaType = "multipart/form-data"
            )))
    public ResponseEntity<String> uploadImage(@Parameter(
            name = "file",
            required = true) @RequestParam("file") MultipartFile file) {
        try {
            String contentType = file.getContentType();
            if (contentType == null || !isImage(contentType)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid file type. Only image files are allowed.");
            }
            ImageService imageService = imageServiceFactory.getImageService();
            imageService.uploadImage(file.getBytes());
            return ResponseEntity.status(HttpStatus.CREATED).body("Image uploaded successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image: " + e.getMessage());
        }
    }

    @GetMapping("/presigned-url/{id}")
    public ResponseEntity<String> getPresignedUrl(@PathVariable String id) {
        AWSImageService imageService = (AWSImageService) imageServiceFactory.getImageService();
        String presignedUrl = imageService.generatePresignedUrl(id);

        if (presignedUrl == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to generate pre-signed URL.");
        }

        return ResponseEntity.ok(presignedUrl);
    }

    private boolean isImage(String contentType) {
        return contentType.equals("image/jpeg") ||
                contentType.equals("image/png") ||
                contentType.equals("image/gif") ||
                contentType.equals("image/webp");
    }
}
