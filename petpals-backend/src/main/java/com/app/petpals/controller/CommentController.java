package com.app.petpals.controller;

import com.app.petpals.entity.Comment;
import com.app.petpals.payload.CommentAddRequest;
import com.app.petpals.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping()
    public Comment addComment(@RequestBody CommentAddRequest request) {
        return commentService.addComment(request);
    }

}
