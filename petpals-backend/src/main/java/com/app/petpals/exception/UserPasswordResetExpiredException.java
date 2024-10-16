package com.app.petpals.exception;

public class UserPasswordResetExpiredException extends RuntimeException {
    public UserPasswordResetExpiredException(String message) {
        super(message);
    }
}