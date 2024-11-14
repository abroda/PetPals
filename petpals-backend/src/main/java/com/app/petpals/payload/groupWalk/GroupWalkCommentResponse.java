package com.app.petpals.payload.groupWalk;

import com.app.petpals.payload.post.GroupWalkCommentCommenterResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class GroupWalkCommentResponse {
    private String commentId;
    private String content;
    private LocalDateTime createdAt;
    private String groupWalkId;
    private GroupWalkCommentCommenterResponse commenter;
    private List<String> likes;
}
