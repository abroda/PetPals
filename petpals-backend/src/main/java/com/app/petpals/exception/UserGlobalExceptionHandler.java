package com.app.petpals.exception;

import com.app.petpals.payload.UserErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class UserGlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<UserErrorResponse> handleUserNotFoundException(UserNotFoundException e) {
        UserErrorResponse error = new UserErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(UserNotVerifiedException.class)
    public ResponseEntity<UserErrorResponse> handleUserNotVerifiedException(UserNotVerifiedException e) {
        UserErrorResponse error = new UserErrorResponse(HttpStatus.FORBIDDEN.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<UserErrorResponse> handleAuthenticationException(AuthenticationException e) {
        UserErrorResponse error = new UserErrorResponse(HttpStatus.UNAUTHORIZED.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(UserVerificationCodeExpiredException.class)
    public ResponseEntity<UserErrorResponse> handleUserVerificationExpiredException(UserVerificationCodeExpiredException e) {
        UserErrorResponse error = new UserErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(UserVerificationCodeInvalidException.class)
    public ResponseEntity<UserErrorResponse> handleUserVerificationInvalidException(UserVerificationCodeInvalidException e) {
        UserErrorResponse error = new UserErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(UserAlreadyVerifiedException.class)
    public ResponseEntity<UserErrorResponse> handlePasswordResetInvalidException(UserAlreadyVerifiedException e) {
        UserErrorResponse error = new UserErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(UserPasswordResetExpiredException.class)
    public ResponseEntity<UserErrorResponse> handleUserPasswordResetExpiredException(UserPasswordResetExpiredException e) {
        UserErrorResponse error = new UserErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(UserPasswordResetInvalidException.class)
    public ResponseEntity<UserErrorResponse> handlePasswordResetInvalidException(UserPasswordResetInvalidException e) {
        UserErrorResponse error = new UserErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(UserPasswordResetNotRequestedException.class)
    public ResponseEntity<UserErrorResponse> handleUserPasswordResetNotRequestedException(UserPasswordResetNotRequestedException e) {
        UserErrorResponse error = new UserErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(UserNoEditFieldsException.class)
    public ResponseEntity<UserErrorResponse> handleUserNoEditFieldsException(UserNoEditFieldsException e) {
        UserErrorResponse error = new UserErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(UserDataException.class)
    public ResponseEntity<UserErrorResponse> handleUserDataException(UserDataException e) {
        UserErrorResponse error = new UserErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<UserErrorResponse> handleUserAlreadyExistsException(UserAlreadyExistsException e) {
        UserErrorResponse error = new UserErrorResponse(HttpStatus.CONFLICT.value(), e.getMessage(), System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
}
