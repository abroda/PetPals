package com.app.petpals.exception.account;

import com.app.petpals.payload.EmailErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class FriendshipGlobalExceptionHandler {
    @ExceptionHandler(FriendshipRequestNotFoundException.class)
    public ResponseEntity<EmailErrorResponse> handleFriendshipRequestNotFoundException(FriendshipRequestNotFoundException e) {
        EmailErrorResponse error = new EmailErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(FriendshipRequestDataException.class)
    public ResponseEntity<EmailErrorResponse> handleFriendshipRequestDataException(FriendshipRequestDataException e) {
        EmailErrorResponse error = new EmailErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
