//========

// THIS IS A TEST CONTROLLER REMOVED FROM CURRENT ENDPOINT LIST

//=========
//
//
//package com.app.petpals.controller;
//
//import com.app.petpals.payload.TextResponse;
//import com.app.petpals.service.AWSImageService;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.Parameter;
//import io.swagger.v3.oas.annotations.media.Content;
//import io.swagger.v3.oas.annotations.parameters.RequestBody;
//import io.swagger.v3.oas.annotations.security.SecurityRequirement;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/api/images")
//@Tag(name = "Images")
//public class ImageController {
//
//    private final AWSImageService awsImageService;
//
//    @GetMapping(value = "/{id}", produces = "image/jpeg")
//    @Operation(summary = "Get image by id.", security = @SecurityRequirement(name = "bearerAuth"))
//    public ResponseEntity<byte[]> getImage(@PathVariable String id) {
//            byte[] imageData = awsImageService.getImage(id);
//            return ResponseEntity.ok(imageData);
//    }
//
////    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
////    @Operation(summary = "Upload image (jpeg, png, gif or webp).", security = @SecurityRequirement(name = "bearerAuth"),
////            requestBody = @RequestBody(content = @Content(
////                    mediaType = "multipart/form-data"
////            )))
////    public ResponseEntity<TextResponse> uploadImage(@Parameter(
////            name = "file",
////            required = true) @RequestParam("file") MultipartFile file) throws IOException {
////            String contentType = file.getContentType();
////            if (contentType == null || !isImage(contentType)) {
////                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new TextResponse("Invalid file type. Only image files are allowed."));
////            }
////            awsImageService.uploadImage(file.getBytes(), contentType);
////            return ResponseEntity.status(HttpStatus.CREATED).body(new TextResponse"Image uploaded successfully."));
////    }
//
//    @GetMapping("/presigned-url/{id}")
//    public ResponseEntity<TextResponse> getPresignedUrl(@PathVariable String id) {
//        String presignedUrl = awsImageService.getPresignedUrl(id);
//        return ResponseEntity.ok(new TextResponse(presignedUrl));
//    }
//
//    private boolean isImage(String contentType) {
//        return contentType.equals("image/jpeg") ||
//                contentType.equals("image/png") ||
//                contentType.equals("image/gif") ||
//                contentType.equals("image/webp");
//    }
//}
