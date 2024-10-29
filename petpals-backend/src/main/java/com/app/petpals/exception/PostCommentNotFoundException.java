package com.app.petpals.exception;

public class PostCommentNotFoundException extends RuntimeException {
    public PostCommentNotFoundException(String message) {
        super(message);
    }
}
