package com.app.petpals.service;

import com.app.petpals.entity.Comment;
import com.app.petpals.entity.CommentableEntity;
import com.app.petpals.entity.User;
import com.app.petpals.payload.CommentAddRequest;
import com.app.petpals.repository.CommentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserService userService;
    private final PostService postService;

    public List<Comment> getTest() {
        return commentRepository.findAll();
    }

    @Transactional
    public Comment addComment(CommentAddRequest request) {
        User user = userService.getById(request.getUserId());

        CommentableEntity entity;
        if (Objects.equals(request.getEntityType(), "post")) {
            entity = postService.getPostById(request.getEntityId());
        } else throw new RuntimeException("not implemented yet.");

        Comment newComment = new Comment();
        newComment.setContent(request.getContent());
        newComment.setUser(user);
        newComment.setEntity(entity);
        return commentRepository.save(newComment);
    }
}
