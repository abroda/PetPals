package com.app.petpals.controller;

import com.app.petpals.entity.Post;
import com.app.petpals.entity.PostComment;
import com.app.petpals.entity.User;
import com.app.petpals.exception.account.UserUnauthorizedException;
import com.app.petpals.payload.*;
import com.app.petpals.payload.post.*;
import com.app.petpals.service.AWSImageService;
import com.app.petpals.service.PostService;
import com.app.petpals.utils.CheckUserAuthorization;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Collections;
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
    @Operation(summary = "Get all posts for tests ONLY.", security = @SecurityRequirement(name = "bearerAuth"))
    private List<Post> getTest() {
        return postService.getTest();
    }

    @GetMapping()
    @Operation(summary = "Get posts page.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Page<PostResponse>> getPosts(Pageable pageable) {
        Page<Post> postPage = postService.getPosts(pageable);
        return ResponseEntity.ok(postPage.map(this::getPostResponse));
    }

    @GetMapping("/{postId}")
    @Operation(summary = "Get post by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PostResponse> getPostById(@PathVariable("postId") String postId) {
        Post post = postService.getPostById(postId);
        return ResponseEntity.ok(getPostResponse(post));
    }

    @GetMapping("/checkNew")
    @Operation(summary = "Check for new posts.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<BooleanResponse> checkForNewPosts(@RequestParam OffsetDateTime time) {
        LocalDateTime localDateTime = time.toLocalDateTime();
        return ResponseEntity.ok(BooleanResponse.builder().response(postService.checkForNewPosts(localDateTime)).build());
    }

    @CheckUserAuthorization(idField = "userId")
    @PostMapping()
    @Operation(summary = "Add new post.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PostResponse> addPost(@RequestBody PostAddRequest request) {
        Post post = postService.addPost(request);
        return ResponseEntity.ok(getPostResponse(post));
    }

    @PutMapping("/{postId}")
    @Operation(summary = "Edit post data by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PostResponse> editPost(@PathVariable String postId, @RequestBody PostEditRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) auth.getPrincipal();
        Post post = postService.updatePost(postId, request, authUser.getId());
        return ResponseEntity.ok(getPostResponse(post));
    }

    @PutMapping(value = "/{postId}/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Edit post picture by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PostResponse> editPostPicture(@PathVariable String postId, @RequestParam MultipartFile file) throws IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) auth.getPrincipal();
        Post post = postService.getPostById(postId);
        if (!post.getCreator().getId().equals(authUser.getId())) {
            throw new UserUnauthorizedException("Unauthorized action.");
        }
        String imageId = null;
        if (file != null && !file.isEmpty()) {
            if (post.getPostPictureId() != null) {
                awsImageService.deleteImage(post.getPostPictureId());
            }
            imageId = awsImageService.uploadImage(file.getBytes(), file.getContentType());
        }
        post = postService.updatePostPicture(postId, imageId);
        return ResponseEntity.ok(getPostResponse(post));
    }

    @DeleteMapping("/{postId}/picture")
    @Operation(summary = "Remove post picture by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PostResponse> removePostPicture(@PathVariable String postId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) auth.getPrincipal();
        Post post = postService.getPostById(postId);
        if (!post.getCreator().getId().equals(authUser.getId())) {
            throw new UserUnauthorizedException("Unauthorized action.");
        }
        if (post.getPostPictureId() != null) {
            awsImageService.deleteImage(post.getPostPictureId());
            post = postService.deletePostPicture(postId);
        }
        return ResponseEntity.ok(getPostResponse(post));
    }

    @DeleteMapping("/{postId}")
    @Operation(summary = "Delete a post. (DELETE PICTURE BEFORE)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<TextResponse> deletePost(@PathVariable String postId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) auth.getPrincipal();
        postService.deletePost(postId, authUser.getId());
        return ResponseEntity.ok(TextResponse.builder().message("Deleted post successfully.").build());
    }

    @CheckUserAuthorization(idField = "userId")
    @PostMapping("/{postId}/like")
    @Operation(summary = "Like a post.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PostResponse> likePost(@PathVariable String postId, @RequestBody LikePostRequest request) {
        Post post = postService.likePost(postId, request);
        return ResponseEntity.ok(getPostResponse(post));
    }

    @CheckUserAuthorization(idField = "userId")
    @DeleteMapping("/{postId}/like")
    @Operation(summary = "Remove like from post.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PostResponse> removeLikePost(@PathVariable String postId, @RequestBody LikePostRequest request) {
        Post post = postService.removeLikePost(postId, request);
        return ResponseEntity.ok(getPostResponse(post));
    }

    private PostResponse getPostResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .description(post.getDescription())
                .imageUrl(Optional.ofNullable(post.getPostPictureId())
                        .map(awsImageService::getPresignedUrl)
                        .orElse(null))
                .createdAt(post.getCreatedAt())
                .author(PostAuthorResponse.builder()
                        .userId(post.getCreator().getId())
                        .username(post.getCreator().getDisplayName())
                        .imageUrl(Optional.ofNullable(post.getCreator().getProfilePictureId())
                                .map(awsImageService::getPresignedUrl)
                                .orElse(null))
                        .build())
                .comments(Optional.ofNullable(post.getComments())
                        .orElse(Collections.emptyList())
                        .stream()
                        .map(this::getPostCommentResponse)
                        .toList())
                .likes(Optional.ofNullable(post.getLikes())
                        .orElse(Collections.emptyList())
                        .stream()
                        .map(user -> String.valueOf(user.getId()))
                        .toList())
                .build();
    }

    private PostCommentResponse getPostCommentResponse(PostComment postComment) {
        return PostCommentResponse.builder()
                .commentId(postComment.getId())
                .content(postComment.getContent())
                .createdAt(postComment.getCreatedAt())
                .commenter(PostCommentCommenterResponse.builder()
                        .userId(postComment.getCommenter().getId())
                        .username(postComment.getCommenter().getDisplayName())
                        .imageUrl(Optional.ofNullable(postComment.getCommenter().getProfilePictureId())
                                .map(awsImageService::getPresignedUrl)
                                .orElse(null))
                        .build())
                .postId(postComment.getPost().getId())
                .likes(Optional.ofNullable(postComment.getLikes())
                        .orElse(Collections.emptyList())
                        .stream()
                        .map(user -> String.valueOf(user.getId()))
                        .toList())
                .build();
    }
}


