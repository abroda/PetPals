package com.app.petpals.exception;

import com.app.petpals.payload.PostCommentErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class PostCommentGlobalExceptionHandler {
    @ExceptionHandler(PostCommentNotFoundException.class)
    public ResponseEntity<PostCommentErrorResponse> handlePostCommentNotFoundException(PostCommentNotFoundException e) {
        PostCommentErrorResponse error = new PostCommentErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(PostCommentDataException.class)
    public ResponseEntity<PostCommentErrorResponse> handlePostCommentDataException(PostCommentDataException e) {
        PostCommentErrorResponse error = new PostCommentErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(PostCommentLikeException.class)
    public ResponseEntity<PostCommentErrorResponse> handlePostCommentLikeException(PostCommentLikeException e) {
        PostCommentErrorResponse error = new PostCommentErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
