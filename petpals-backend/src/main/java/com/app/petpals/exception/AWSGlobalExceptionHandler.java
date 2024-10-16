package com.app.petpals.exception;

import com.app.petpals.payload.AWSErrorResponse;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class AWSGlobalExceptionHandler {
    @ExceptionHandler(AWSGetImageException.class)
    public ResponseEntity<AWSErrorResponse> handleAWSGetImageException(AWSGetImageException e) {
        AWSErrorResponse error = new AWSErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(AWSUploadImageException.class)
    public ResponseEntity<AWSErrorResponse> handleAWSUploadImageException(AWSUploadImageException e) {
        AWSErrorResponse error = new AWSErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(AWSPresignUrlException.class)
    public ResponseEntity<AWSErrorResponse> handleAWSPresignUrlException(AWSPresignUrlException e) {
        AWSErrorResponse error = new AWSErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(AWSFailedToDeleteException.class)
    public ResponseEntity<AWSErrorResponse> handleAWSFailedToDeleteException(AWSFailedToDeleteException e) {
        AWSErrorResponse error = new AWSErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
