package com.app.petpals.exception.post;

public class PostCommentNotFoundException extends RuntimeException {
    public PostCommentNotFoundException(String message) {
        super(message);
    }
}
