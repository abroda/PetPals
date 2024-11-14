package com.app.petpals.service;

import com.app.petpals.entity.GroupWalk;
import com.app.petpals.entity.GroupWalkComment;
import com.app.petpals.entity.User;
import com.app.petpals.exception.account.UserUnauthorizedException;
import com.app.petpals.exception.groupWalk.GroupWalkCommentLikeException;
import com.app.petpals.exception.groupWalk.GroupWalkCommentNotFound;
import com.app.petpals.exception.post.PostCommentDataException;
import com.app.petpals.payload.groupWalk.GroupWalkCommentAddRequest;
import com.app.petpals.payload.groupWalk.GroupWalkCommentEditRequest;
import com.app.petpals.payload.groupWalk.GroupWalkCommentResponse;
import com.app.petpals.payload.post.GroupWalkCommentCommenterResponse;
import com.app.petpals.repository.GroupWalkCommentRepository;
import com.app.petpals.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GroupWalkCommentService {
    private final GroupWalkCommentRepository groupWalkCommentRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final GroupWalkService groupWalkService;
    private final AWSImageService awsImageService;

    public GroupWalkComment getGroupWalkCommentById(String grouWalkCommentId) {
        return groupWalkCommentRepository.findById(grouWalkCommentId).orElseThrow(() -> new GroupWalkCommentNotFound("Group walk comment not found."));
    }

    public List<GroupWalkComment> getGroupWalkCommentsByWalkId(String grouWalkId) {
        groupWalkService.getGroupWalkById(grouWalkId);
        return groupWalkCommentRepository.findByGroupWalkId(grouWalkId);
    }

    @Transactional
    public GroupWalkComment addGroupWalkComment(String walkId, String userId, GroupWalkCommentAddRequest request) {
        User user = userService.getById(userId);
        GroupWalk groupWalk = groupWalkService.getGroupWalkById(walkId);
        GroupWalkComment newComment = new GroupWalkComment();
        newComment.setContent(request.getContent());
        newComment.setCommenter(user);
        newComment.setGroupWalk(groupWalk);
        newComment.setCreatedAt(LocalDateTime.now());
        return groupWalkCommentRepository.save(newComment);
    }

    public GroupWalkComment updateGroupWalkComment(String groupWalkCommentId,  String userId, GroupWalkCommentEditRequest request) {
        if (request.getContent() == null || request.getContent().isEmpty())
            throw new PostCommentDataException("Group walk comment content is required.");
        GroupWalkComment groupWalkComment = getGroupWalkCommentById(groupWalkCommentId);
        if (!groupWalkComment.getCommenter().getId().equals(userId)) {
            throw new UserUnauthorizedException("Unauthorized action.");
        }
        groupWalkComment.setContent(request.getContent());
        return groupWalkCommentRepository.save(groupWalkComment);
    }

    @Transactional
    public void deleteGroupWalkComment(String groupWalkCommentId, String userId) {
        GroupWalkComment groupWalkComment = getGroupWalkCommentById(groupWalkCommentId);
        if (!groupWalkComment.getCommenter().getId().equals(userId)) {
            throw new UserUnauthorizedException("Unauthorized action.");
        }
        groupWalkCommentRepository.deleteById(groupWalkCommentId);
    }

    @Transactional
    public GroupWalkComment toggleLikeGroupWalkComment(String groupWalkCommentId, String userId) {
        User user = userService.getById(userId);
        GroupWalkComment groupWalkComment = getGroupWalkCommentById(groupWalkCommentId);
        if (user.getLikedGroupWalkComments().contains(groupWalkComment) && groupWalkComment.getLikes().contains(user)) {
            // handle removing like from comment
            user.getLikedGroupWalkComments().remove(groupWalkComment);
            groupWalkComment.getLikes().remove(user);
            userRepository.save(user);
            return groupWalkCommentRepository.save(groupWalkComment);
        } else if (!user.getLikedGroupWalkComments().contains(groupWalkComment) && !groupWalkComment.getLikes().contains(user)) {
            // handle liking comment
            user.getLikedGroupWalkComments().add(groupWalkComment);
            groupWalkComment.getLikes().add(user);
            userRepository.save(user);
            return groupWalkCommentRepository.save(groupWalkComment);
        } else {
            // resetting to default unliked state
            user.getLikedGroupWalkComments().remove(groupWalkComment);
            groupWalkComment.getLikes().remove(user);
            userRepository.save(user);
            groupWalkCommentRepository.save(groupWalkComment);

            throw new GroupWalkCommentLikeException(
                    "Inconsistent like state detected between user " + userId +
                            " and comment " + groupWalkCommentId + ". The like relationship has been reset. " +
                            "Please try again."
            );
        }
    }

    public GroupWalkCommentResponse createGroupWalkCommentResponse(GroupWalkComment groupWalkComment) {
        return GroupWalkCommentResponse.builder()
                .commentId(groupWalkComment.getId())
                .content(groupWalkComment.getContent())
                .createdAt(groupWalkComment.getCreatedAt())
                .commenter(GroupWalkCommentCommenterResponse.builder()
                        .userId(groupWalkComment.getCommenter().getId())
                        .username(groupWalkComment.getCommenter().getDisplayName())
                        .imageUrl(Optional.ofNullable(groupWalkComment.getCommenter().getProfilePictureId())
                                .map(awsImageService::getPresignedUrl)
                                .orElse(null))
                        .build())
                .groupWalkId(groupWalkComment.getGroupWalk().getId())
                .likes(Optional.ofNullable(groupWalkComment.getLikes())
                        .orElse(Collections.emptyList())
                        .stream()
                        .map(user -> String.valueOf(user.getId()))
                        .toList())
                .build();
    }
}
