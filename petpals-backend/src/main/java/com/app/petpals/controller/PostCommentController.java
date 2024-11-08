package com.app.petpals.controller;

import com.app.petpals.entity.PostComment;
import com.app.petpals.entity.User;
import com.app.petpals.payload.*;
import com.app.petpals.service.AWSImageService;
import com.app.petpals.service.PostCommentService;
import com.app.petpals.utils.CheckUserAuthorization;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Tag(name = "Post - Comments")
public class PostCommentController {
    private final PostCommentService postCommentService;
    private final AWSImageService awsImageService;

    @GetMapping("/comments/test")
    @Operation(summary = "Get all post comments for tests ONLY.", security = @SecurityRequirement(name = "bearerAuth"))
    public List<PostComment> test() {
        return postCommentService.getAllPostComments();
    }

    @GetMapping("/comments")
    @Operation(summary = "Get all post comments.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<PostCommentResponse>> getAllPostComments() {
        List<PostComment> postComments = postCommentService.getAllPostComments();
        return ResponseEntity.ok(postComments.stream().map(this::getPostCommentResponseResponse).toList());
    }

    @GetMapping("/{postId}/comments")
    @Operation(summary = "Get all post comments by postId.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<PostCommentResponse>> getAllPostCommentsByPostId(@PathVariable("postId") String postId) {
        List<PostComment> postComments = postCommentService.getAllPostCommentsByPostId(postId);
        return ResponseEntity.ok(postComments.stream().map(this::getPostCommentResponseResponse).toList());
    }

    @GetMapping("/comments/{commentId}")
    @Operation(summary = "Get post comment by id", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PostCommentResponse> getPostCommentById(@PathVariable("commentId") String commentId) {
        PostComment postComment = postCommentService.getPostCommentById(commentId);
        return ResponseEntity.ok(getPostCommentResponseResponse(postComment));
    }

    @CheckUserAuthorization(idField = "userId")
    @PostMapping("/{postId}/comments")
    @Operation(summary = "Add new post comment.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PostCommentResponse> addPostComment(@PathVariable("postId") String postId, @RequestBody PostCommentAddRequest request) {
        PostComment postComment = postCommentService.addComment(postId, request);
        return ResponseEntity.ok(getPostCommentResponseResponse(postComment));
    }

    @PutMapping("/comments/{commentId}")
    @Operation(summary = "Edit post comment by commentId.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PostCommentResponse> editPostComment(@PathVariable("commentId") String commentId, @RequestBody PostCommentEditRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) auth.getPrincipal();
        PostComment postComment = postCommentService.updatePostComment(commentId, request, authUser.getId());
        return ResponseEntity.ok(getPostCommentResponseResponse(postComment));
    }

    @DeleteMapping("/comments/{commentId}")
    @Operation(summary = "Delete post comment by commentId.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<TextResponse> deletePostCommentByCommentId(@PathVariable("commentId") String commentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) auth.getPrincipal();
        postCommentService.deletePostComment(commentId, authUser.getId());
        return ResponseEntity.ok(new TextResponse("Comment deleted successfully."));
    }

    @CheckUserAuthorization(idField = "userId")
    @PostMapping("/comments/{commentId}/like")
    @Operation(summary = "Like post comment by commentId.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PostCommentResponse> likePostComment(@PathVariable("commentId") String commentId, @RequestBody LikePostCommentRequest request) {
        PostComment postComment = postCommentService.likePostComment(commentId, request);
        return ResponseEntity.ok(getPostCommentResponseResponse(postComment));
    }

    @CheckUserAuthorization(idField = "userId")
    @DeleteMapping("/comments/{commentId}/like")
    @Operation(summary = "Remove like post comment by commentId.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PostCommentResponse> removeLikePostComment(@PathVariable("commentId") String commentId, @RequestBody LikePostCommentRequest request) {
        PostComment postComment = postCommentService.removeLikePostComment(commentId, request);
        return ResponseEntity.ok(getPostCommentResponseResponse(postComment));
    }

    private PostCommentResponse getPostCommentResponseResponse(PostComment postComment) {
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
