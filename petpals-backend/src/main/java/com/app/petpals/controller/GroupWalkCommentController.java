package com.app.petpals.controller;

import com.app.petpals.entity.GroupWalkComment;
import com.app.petpals.entity.User;
import com.app.petpals.payload.TextResponse;
import com.app.petpals.payload.groupWalk.GroupWalkCommentAddRequest;
import com.app.petpals.payload.groupWalk.GroupWalkCommentEditRequest;
import com.app.petpals.payload.groupWalk.GroupWalkCommentResponse;
import com.app.petpals.service.GroupWalkCommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groupWalks")
@RequiredArgsConstructor
@Tag(name = "Walks - Comments")
public class GroupWalkCommentController {
    private final GroupWalkCommentService groupWalkCommentService;

    @GetMapping("/{walkId}/comments")
    @Operation(summary = "Get all group walk comments by walk id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<GroupWalkCommentResponse>> getGroupWalkCommentsByWalkId(@PathVariable("walkId") String walkId) {
        List<GroupWalkComment> groupWalkCommentList = groupWalkCommentService.getGroupWalkCommentsByWalkId(walkId);
        return ResponseEntity.ok(groupWalkCommentList.stream().map(groupWalkCommentService::createGroupWalkCommentResponse).collect(Collectors.toList()));
    }

    @GetMapping("/comments/{commentId}")
    @Operation(summary = "Get group walk comment by id.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<GroupWalkCommentResponse> getGroupWalkCommentById(@PathVariable("commentId") String commentId) {
        GroupWalkComment groupWalkComment = groupWalkCommentService.getGroupWalkCommentById(commentId);
        return ResponseEntity.ok(groupWalkCommentService.createGroupWalkCommentResponse(groupWalkComment));
    }

    @PostMapping("/{walkId}/comments")
    @Operation(summary = "Add group walk comment.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<GroupWalkCommentResponse> addGroupWalkCommentByWalkId(@PathVariable("walkId") String walkId, @RequestBody GroupWalkCommentAddRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) auth.getPrincipal();
        GroupWalkComment groupWalkComment = groupWalkCommentService.addGroupWalkComment(walkId, authUser.getId(), request);
        return ResponseEntity.ok(groupWalkCommentService.createGroupWalkCommentResponse(groupWalkComment));
    }

    @PutMapping("/comments/{commentId}")
    @Operation(summary = "Edit group walk comment.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<GroupWalkCommentResponse> updateGroupWalkCommentByWalkId(@PathVariable("commentId") String commentId, @RequestBody GroupWalkCommentEditRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) auth.getPrincipal();
        GroupWalkComment groupWalkComment = groupWalkCommentService.updateGroupWalkComment(commentId, authUser.getId(), request);
        return ResponseEntity.ok(groupWalkCommentService.createGroupWalkCommentResponse(groupWalkComment));
    }

    @DeleteMapping("/comments/{commentId}")
    @Operation(summary = "Delete group walk comment.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<TextResponse> deleteGroupWalkCommentByWalkId(@PathVariable("commentId") String commentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) auth.getPrincipal();
        groupWalkCommentService.deleteGroupWalkComment(commentId, authUser.getId());
        return ResponseEntity.ok(TextResponse.builder().message("Group walk comment deleted successfully.").build());
    }

    @PostMapping("/comments/{commentId}/toggleLike")
    @Operation(summary = "Toggle like on group walk comment.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<GroupWalkCommentResponse> toggleWalkOnGroupWalkComment(@PathVariable("commentId") String commentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) auth.getPrincipal();
        GroupWalkComment groupWalkComment = groupWalkCommentService.toggleLikeGroupWalkComment(commentId, authUser.getId());
        return ResponseEntity.ok(groupWalkCommentService.createGroupWalkCommentResponse(groupWalkComment));
    }
}
