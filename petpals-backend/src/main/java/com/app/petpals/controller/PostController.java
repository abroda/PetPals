package com.app.petpals.controller;

import com.app.petpals.entity.Post;
import com.app.petpals.payload.PostAddRequest;
import com.app.petpals.payload.PostResponse;
import com.app.petpals.service.AWSImageService;
import com.app.petpals.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Tag(name = "Post")
public class PostController {
    private final PostService postService;
    private final AWSImageService awsImageService;

    @GetMapping("/test")
    private List<Post> getTest(){
        return postService.getTest();
    }

    @GetMapping
    @Operation(summary = "Get posts page.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Page<PostResponse>> getPosts(Pageable pageable) {
        Page<Post> postPage = postService.getPosts(pageable);
        return ResponseEntity.ok(postPage.map(post -> PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .description(post.getDescription())
                .imageUrl(Optional.ofNullable(post.getPostPictureId())
                        .map(awsImageService::getPresignedUrl)
                        .orElse(null))
                .build()));
    }

    @PostMapping()
    @Operation(summary = "Add new post.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PostResponse> addPost(@RequestBody PostAddRequest request) {
        Post post = postService.addPost(request);
        return ResponseEntity.ok(PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .description(post.getDescription())
                .imageUrl(Optional.ofNullable(post.getPostPictureId())
                        .map(awsImageService::getPresignedUrl)
                        .orElse(null))
                .build());
    }

    @PutMapping(value = "/{id}/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Edit post picture by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PostResponse> editPostPicture(@PathVariable String id, @RequestParam MultipartFile file) throws IOException {
        Post post = postService.getPostById(id);
        String imageId = null;
        if (file != null && !file.isEmpty()) {
            if (post.getPostPictureId() != null) {
                awsImageService.deleteImage(post.getPostPictureId());
            }
            imageId = awsImageService.uploadImage(file.getBytes(), file.getContentType());
        }
        post = postService.updatePostPicture(id, imageId);
        return ResponseEntity.ok(PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .description(post.getDescription())
                .imageUrl(Optional.ofNullable(post.getPostPictureId())
                        .map(awsImageService::getPresignedUrl)
                        .orElse(null))
                .build());
    }
}
