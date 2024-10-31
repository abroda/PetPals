package com.app.petpals.controller;

import com.app.petpals.entity.PostComment;
import com.app.petpals.entity.User;
import com.app.petpals.payload.PostCommentAddRequest;
import com.app.petpals.service.PostCommentService;
import com.app.petpals.utils.CheckUserAuthorization;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Tag(name = "Post - Comments")
public class PostCommentController {
    private final PostCommentService postCommentService;

    @GetMapping("/comments/test")
    @Operation(summary = "Get all post comments for tests ONLY.", security = @SecurityRequirement(name = "bearerAuth"))
    public List<PostComment> test() {
        return postCommentService.getTest();
    }

    @CheckUserAuthorization(idField = "userId")
    @PostMapping("/{postId}/comments")
    @Operation(summary = "Add new comment.", security = @SecurityRequirement(name = "bearerAuth"))
    public PostComment addComment(@PathVariable String postId, @RequestBody PostCommentAddRequest request) {
        return postCommentService.addComment(postId, request);
    }

}
