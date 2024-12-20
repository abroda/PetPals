package com.app.petpals.service;

import com.app.petpals.entity.Post;
import com.app.petpals.entity.PostComment;
import com.app.petpals.entity.User;
import com.app.petpals.exception.groupWalk.GroupWalkCommentLikeException;
import com.app.petpals.exception.post.PostCommentDataException;
import com.app.petpals.exception.post.PostCommentLikeException;
import com.app.petpals.exception.post.PostCommentNotFoundException;
import com.app.petpals.exception.account.UserUnauthorizedException;
import com.app.petpals.payload.post.LikePostCommentRequest;
import com.app.petpals.payload.post.PostCommentAddRequest;
import com.app.petpals.payload.post.PostCommentEditRequest;
import com.app.petpals.repository.PostCommentRepository;
import com.app.petpals.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostCommentService {
    private final PostCommentRepository postCommentRepository;
    private final UserService userService;
    private final PostService postService;
    private final UserRepository userRepository;

    public List<PostComment> getAllPostComments() {
        return postCommentRepository.findAll();
    }

    public List<PostComment> getAllPostCommentsByPostId(String postId) {
        postService.getPostById(postId);
        return postCommentRepository.findByPostId(postId);
    }

    public PostComment getPostCommentById(String postCommentId) {
        return postCommentRepository.findById(postCommentId).orElseThrow(() -> new PostCommentNotFoundException("Post comment not found."));
    }

    @Transactional
    public PostComment addComment(String postId, PostCommentAddRequest request, String userId) {
        User user = userService.getById(userId);
        Post post = postService.getPostById(postId);
        PostComment newComment = new PostComment();
        newComment.setContent(request.getContent());
        newComment.setCommenter(user);
        newComment.setPost(post);
        newComment.setCreatedAt(LocalDateTime.now());
        return postCommentRepository.save(newComment);
    }

    public PostComment updatePostComment(String postCommentId, PostCommentEditRequest request, String userId) {
        if (request.getContent() == null || request.getContent().isEmpty())
            throw new PostCommentDataException("Post comment content is required.");
        PostComment postComment = getPostCommentById(postCommentId);
        if (!postComment.getCommenter().getId().equals(userId)) {
            throw new UserUnauthorizedException("Unauthorized action.");
        }
        postComment.setContent(request.getContent());
        return postCommentRepository.save(postComment);
    }

    @Transactional
    public void deletePostComment(String postCommentId, String userId) {
        PostComment postComment = getPostCommentById(postCommentId);
        if (!postComment.getCommenter().getId().equals(userId)) {
            throw new UserUnauthorizedException("Unauthorized action.");
        }
        postCommentRepository.deleteById(postCommentId);
    }

    @Transactional
    public PostComment toggleLikePostComment(String commentId, String userId) {
        User user = userService.getById(userId);
        PostComment postComment = getPostCommentById(commentId);
        if (user.getLikedPostComments().contains(postComment) && postComment.getLikes().contains(user)) {
            // handle removing like from comment
            user.getLikedPostComments().remove(postComment);
            postComment.getLikes().remove(user);
            userRepository.save(user);
            return postCommentRepository.save(postComment);
        } else if (!user.getLikedPostComments().contains(postComment) && !postComment.getLikes().contains(user)) {
            // handle liking comment
            user.getLikedPostComments().add(postComment);
            postComment.getLikes().add(user);
            userRepository.save(user);
            return postCommentRepository.save(postComment);
        } else {
            // resetting to default unliked state
            user.getLikedPostComments().remove(postComment);
            postComment.getLikes().remove(user);
            userRepository.save(user);
            postCommentRepository.save(postComment);

            throw new GroupWalkCommentLikeException(
                    "Inconsistent like state detected between user " + userId +
                            " and post comment " + postComment + ". The like relationship has been reset. " +
                            "Please try again."
            );
        }
    }
}
