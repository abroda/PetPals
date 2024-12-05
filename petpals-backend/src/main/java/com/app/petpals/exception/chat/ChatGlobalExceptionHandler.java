package com.app.petpals.exception.chat;

import com.app.petpals.payload.chat.ChatErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ChatGlobalExceptionHandler {

    @ExceptionHandler(ChatroomDataException.class)
    public ResponseEntity<ChatErrorResponse> handleChatroomDataException(ChatroomDataException e) {
        ChatErrorResponse error = new ChatErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
