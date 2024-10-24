package com.app.petpals.exception;

import com.app.petpals.payload.TextResponse;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<TextResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        Throwable cause = ex.getCause();
        if (cause instanceof InvalidFormatException invalidFormatException) {
            Class<?> targetType = invalidFormatException.getTargetType();
            if (targetType.isEnum()) {
                List<?> enumValues = List.of(targetType.getEnumConstants());
                String allowedValues = enumValues.toString();

                String errorMessage = String.format("Invalid value provided. Accepted values: %s", allowedValues);
                TextResponse textResponse = new TextResponse("Bad request" + errorMessage);
                return new ResponseEntity<>(textResponse, HttpStatus.BAD_REQUEST);
            }
        }

        TextResponse textResponse = new TextResponse("Malformed JSON request");
        return new ResponseEntity<>(textResponse, HttpStatus.BAD_REQUEST);
    }
}
