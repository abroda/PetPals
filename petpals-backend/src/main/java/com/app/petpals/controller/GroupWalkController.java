package com.app.petpals.controller;

import com.app.petpals.entity.Dog;
import com.app.petpals.entity.GroupWalk;
import com.app.petpals.entity.User;
import com.app.petpals.payload.*;
import com.app.petpals.service.AWSImageService;
import com.app.petpals.service.GroupWalkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/groupWalks")
@Tag(name = "Walks")
public class GroupWalkController {
    private final GroupWalkService groupWalkService;
    private final AWSImageService awsImageService;

    @GetMapping()
    @Operation(summary = "Get all group walks.", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<List<GroupWalkResponse>> getAllGroupWalks() {
        List<GroupWalk> groupWalkList = groupWalkService.getAllGroupWalks();
        return ResponseEntity.ok(groupWalkList.stream().map(this::createGroupWalkResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{groupWalkId}")
    @Operation(summary = "Get group walk by id.", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<GroupWalkResponse> getGroupWalkById(@PathVariable String groupWalkId) {
        GroupWalk groupWalkList = groupWalkService.getGroupWalkById(groupWalkId);
        return ResponseEntity.ok(createGroupWalkResponse(groupWalkList));
    }

    @PostMapping()
    @Operation(summary = "Create new walk.", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<GroupWalkResponse> createNewWalk(@RequestBody GroupWalkAddRequest request) {
        System.out.println(request);
        GroupWalk groupWalk = groupWalkService.saveGroupWalk(request);
        return ResponseEntity.ok(createGroupWalkResponse(groupWalk));
    }

    @PostMapping("/{groupWalkId}/join")
    @Operation(summary = "Edit group walk by id.", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<GroupWalkResponse> joinGroupWalkById(@PathVariable String groupWalkId, @RequestBody GroupWalkJoinRequest request) {
        GroupWalk groupWalkList = groupWalkService.joinWalk(groupWalkId, request);
        return ResponseEntity.ok(createGroupWalkResponse(groupWalkList));
    }

    @PutMapping("/{groupWalkId}")
    @Operation(summary = "Edit group walk by id.", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<GroupWalkResponse> editGroupWalkById(@PathVariable String groupWalkId, @RequestBody GroupWalkEditRequest request) {
        GroupWalk groupWalkList = groupWalkService.editGroupWalk(groupWalkId, request);
        return ResponseEntity.ok(createGroupWalkResponse(groupWalkList));
    }

    @DeleteMapping("/{groupWalkId}")
    @Operation(summary = "Delete group walk by id.", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<TextResponse> deleteGroupWalkById(@PathVariable String groupWalkId) {
        groupWalkService.deleteGroupWalk(groupWalkId);
        return ResponseEntity.ok(TextResponse.builder().message("Group walk deleted successfully.").build());
    }

    private GroupWalkResponse createGroupWalkResponse(GroupWalk groupWalk) {
        return GroupWalkResponse.builder()
                .id(groupWalk.getId())
                .title(groupWalk.getTitle())
                .description(groupWalk.getDescription())
                .location(groupWalk.getLocation())
                .datetime(groupWalk.getDatetime().toString())
                .creator(
                        GroupWalkCreatorResponse.builder()
                                .userId(groupWalk.getCreator().getId())
                                .username(groupWalk.getCreator().getDisplayName())
                                .imageUrl(Optional.ofNullable(groupWalk.getCreator().getProfilePictureId())
                                        .map(awsImageService::getPresignedUrl)
                                        .orElse(null))
                                .build()
                )
                .tags(groupWalk.getTags())
                .participants(getGroupWalkParticipants(groupWalk))
                .build();
    }

    private List<GroupWalkParticipantResponse> getGroupWalkParticipants(GroupWalk groupWalk) {
        return groupWalk.getParticipants().stream()
                .collect(Collectors.groupingBy(Dog::getUser))
                .entrySet().stream()
                .map(entry -> {
                    User owner = entry.getKey();
                    List<GroupWalkParticipantDogResponse> dogs = entry.getValue().stream()
                            .map(dog -> GroupWalkParticipantDogResponse.builder()
                                    .dogId(dog.getId())
                                    .name(dog.getName())
                                    .imageUrl(Optional.ofNullable(dog.getImageId())
                                            .map(awsImageService::getPresignedUrl)
                                            .orElse(null))
                                    .build())
                            .collect(Collectors.toList());

                    return GroupWalkParticipantResponse.builder()
                            .userId(owner.getId())
                            .username(owner.getUsername())
                            .imageUrl((Optional.ofNullable(owner.getProfilePictureId())
                                    .map(awsImageService::getPresignedUrl)
                                    .orElse(null)))
                            .dogs(dogs)
                            .build();
                })
                .collect(Collectors.toList());
    }
}
