package com.app.petpals.exception.groupWalk;

import com.app.petpals.payload.groupWalk.GroupWalkErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GroupWalkCommentExceptionHandler {
    @ExceptionHandler(GroupWalkCommentNotFound.class)
    public ResponseEntity<GroupWalkErrorResponse> handleGroupWalkCommentNotFound(GroupWalkCommentNotFound e) {
        GroupWalkErrorResponse error = new GroupWalkErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
