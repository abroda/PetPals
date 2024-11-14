package com.app.petpals.exception.dog;

import com.app.petpals.payload.dog.DogErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class DogGlobalExceptionHandler {

    @ExceptionHandler(DogNotFoundException.class)
    public ResponseEntity<DogErrorResponse> handleDogNotFoundException(DogNotFoundException e) {
        DogErrorResponse error = new DogErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(DogTagNotFoundException.class)
    public ResponseEntity<DogErrorResponse> handleDogTagNotFoundException(DogTagNotFoundException e) {
        DogErrorResponse error = new DogErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(DogDataException.class)
    public ResponseEntity<DogErrorResponse> handleDogDataException(DogDataException e) {
        DogErrorResponse error = new DogErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
