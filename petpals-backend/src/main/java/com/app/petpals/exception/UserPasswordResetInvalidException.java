package com.app.petpals.exception;

public class UserPasswordResetInvalidException extends RuntimeException {
    public UserPasswordResetInvalidException(String message) {
        super(message);
    }
}