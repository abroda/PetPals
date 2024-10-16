package com.app.petpals.exception;

import com.app.petpals.payload.EmailErrorResponse;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class EmailGlobalExceptionHandler {
    @ExceptionHandler(MessagingException.class)
    public ResponseEntity<EmailErrorResponse> handleMessagingException(MessagingException e) {
        EmailErrorResponse error = new EmailErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
