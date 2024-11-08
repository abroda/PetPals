package com.app.petpals.exception;

import com.app.petpals.payload.GroupWalkErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GroupWalkExceptionHandler {

    @ExceptionHandler(GroupWalkNotFoundException.class)
    public ResponseEntity<GroupWalkErrorResponse> handleGroupWalkNotFoundException(GroupWalkNotFoundException e) {
        GroupWalkErrorResponse error = new GroupWalkErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
