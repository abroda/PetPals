package com.app.petpals.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {
    private String id;
    private String title;
    private String description;
    private String imageUrl;
    private LocalDateTime createdAt;
    private PostAuthorResponse author;
    private List<PostCommentResponse> comments;
    private List<String> likes;
}
