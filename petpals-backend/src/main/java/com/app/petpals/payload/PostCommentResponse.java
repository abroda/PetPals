package com.app.petpals.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class PostCommentResponse {
    private String commentId;
    private String content;
    private LocalDateTime createdAt;
    private String postId;
    private PostCommentCommenterResponse commenter;
    private List<String> likes;
}
