package com.app.petpals.controller;

import com.app.petpals.entity.GroupWalk;
import com.app.petpals.entity.User;
import com.app.petpals.payload.*;
import com.app.petpals.payload.groupWalk.*;
import com.app.petpals.service.GroupWalkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/groupWalks")
@Tag(name = "Walks")
public class GroupWalkController {
    private final GroupWalkService groupWalkService;

    @GetMapping("/test")
    @Operation(summary = "Get all group walks. - TEST ONLY", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<List<GroupWalkResponse>> getAllGroupWalks() {
        List<GroupWalk> groupWalkList = groupWalkService.getAllGroupWalks();
        return ResponseEntity.ok(groupWalkList.stream().map(groupWalkService::createGroupWalkResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{groupWalkId}")
    @Operation(summary = "Get group walk by id.", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<GroupWalkResponse> getGroupWalkById(@PathVariable String groupWalkId) {
        GroupWalk groupWalkList = groupWalkService.getGroupWalkById(groupWalkId);
        return ResponseEntity.ok(groupWalkService.createGroupWalkResponse(groupWalkList));
    }

    @GetMapping("/tags/suggest")
    @Operation(summary = "Get suggested tags by tag query.", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<GroupWalkTagsResponse> getSuggestedGroupWalkTags(@RequestParam("query") String query) {
        return ResponseEntity.ok(GroupWalkTagsResponse.builder().tags(groupWalkService.getSuggestedTags(query)).build());
    }

    @GetMapping("/tags")
    @Operation(summary = "Get paginated group walks filtered by tags. - Tags have to be full", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Page<GroupWalkResponse>> getGroupWalks(
            @RequestParam(value = "tags", required = false) String tags,
            Pageable pageable) {
        List<String> tagList = (tags == null || tags.isEmpty())
                ? Collections.emptyList()
                : Arrays.asList(tags.split("\\s*,\\s*"));
        Page<GroupWalk> groupWalkPage = groupWalkService.getGroupWalksByTags(tagList, pageable);
        Page<GroupWalkResponse> responsePage = groupWalkPage.map(groupWalkService::createGroupWalkResponse);
        return ResponseEntity.ok(responsePage);
    }

    @PostMapping()
    @Operation(summary = "Create new walk.", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<GroupWalkResponse> createNewWalk(@RequestBody GroupWalkAddRequest request) {
        System.out.println(request);
        GroupWalk groupWalk = groupWalkService.saveGroupWalk(request);
        return ResponseEntity.ok(groupWalkService.createGroupWalkResponse(groupWalk));
    }

    @PostMapping("/{groupWalkId}/join")
    @Operation(summary = "Join walk by id.", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<GroupWalkResponse> joinGroupWalkById(@PathVariable String groupWalkId, @RequestBody GroupWalkJoinRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) auth.getPrincipal();
        GroupWalk groupWalkList = groupWalkService.joinWalk(groupWalkId, authUser.getId(), request);
        return ResponseEntity.ok(groupWalkService.createGroupWalkResponse(groupWalkList));
    }

    @PostMapping("/{groupWalkId}/leave")
    @Operation(summary = "Leave walk by id.", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<GroupWalkResponse> joinGroupWalkById(@PathVariable String groupWalkId, @RequestBody GroupWalkLeaveRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) auth.getPrincipal();
        GroupWalk groupWalkList = groupWalkService.leaveWalk(groupWalkId, authUser.getId(), request);
        return ResponseEntity.ok(groupWalkService.createGroupWalkResponse(groupWalkList));
    }

    @PutMapping("/{groupWalkId}")
    @Operation(summary = "Edit group walk by id.", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<GroupWalkResponse> editGroupWalkById(@PathVariable String groupWalkId, @RequestBody GroupWalkEditRequest request) {
        GroupWalk groupWalkList = groupWalkService.editGroupWalk(groupWalkId, request);
        return ResponseEntity.ok(groupWalkService.createGroupWalkResponse(groupWalkList));
    }

    @DeleteMapping("/{groupWalkId}")
    @Operation(summary = "Delete group walk by id.", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<TextResponse> deleteGroupWalkById(@PathVariable String groupWalkId) {
        groupWalkService.deleteGroupWalk(groupWalkId);
        return ResponseEntity.ok(TextResponse.builder().message("Group walk deleted successfully.").build());
    }
}
