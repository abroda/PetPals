package com.app.petpals.controller;

import com.app.petpals.entity.GroupWalk;
import com.app.petpals.entity.User;
import com.app.petpals.payload.groupWalk.GroupWalkResponse;
import com.app.petpals.service.GroupWalkService;
import com.app.petpals.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.time.temporal.TemporalAmount;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User - Walks")
public class UserWalksController {
    private final UserService userService;
    private final GroupWalkService groupWalkService;

    @GetMapping("/{userId}/groupWalks/created")
    @Operation(summary = "Get all created group walks.", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<List<GroupWalkResponse>> getAllCreatedGroupWalks(@PathVariable("userId") String userId) {
        User user = userService.getById(userId);
        return ResponseEntity.ok(user.getCreatedWalks().stream().map(groupWalkService::createGroupWalkResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{userId}/groupWalks/joined")
    @Operation(summary = "Get all joined group walks.", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<List<GroupWalkResponse>> getAllJoinedGroupWalks(@PathVariable("userId") String userId) {
        User user = userService.getById(userId);
        Set<GroupWalk> uniqueJoinedWalks = user.getDogs().stream()
                .flatMap(dog -> dog.getJoinedWalks().stream())
                .filter(walk -> walk.getDatetime().isAfter(ZonedDateTime.now().minusHours(1)))
                .collect(Collectors.toSet());
        return ResponseEntity.ok(uniqueJoinedWalks.stream().map(groupWalkService::createGroupWalkResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{userId}/groupWalks/joined/ongoing")
    @Operation(summary = "Get all joined group walks.", security = @SecurityRequirement(name = "bearerAuth"))
    private ResponseEntity<List<GroupWalkResponse>> getOngoingJoinedGroupWalks(@PathVariable("userId") String userId) {
        User user = userService.getById(userId);
        Set<GroupWalk> uniqueJoinedWalks = user.getDogs().stream()
                .flatMap(dog -> dog.getJoinedWalks().stream())
                .filter(walk -> walk.getDatetime().isAfter(ZonedDateTime.now().minusHours(1)) && walk.getDatetime().isBefore(ZonedDateTime.now().plusMinutes(15)))
                .collect(Collectors.toSet());

        return ResponseEntity.ok(uniqueJoinedWalks.stream().map(groupWalkService::createGroupWalkResponse).collect(Collectors.toList()));
    }
}

