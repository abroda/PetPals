package com.app.petpals.exception;

import com.app.petpals.payload.PostErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class PostGlobalExceptionHandler {
    @ExceptionHandler(PostNotFoundException.class)
    public ResponseEntity<PostErrorResponse> handlePostNotFoundException(PostNotFoundException e) {
        PostErrorResponse error = new PostErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(PostDataException.class)
    public ResponseEntity<PostErrorResponse> handlePostDataException(PostDataException e) {
        PostErrorResponse error = new PostErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(PostLikeException.class)
    public ResponseEntity<PostErrorResponse> handlePostLikeException(PostLikeException e) {
        PostErrorResponse error = new PostErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

}
