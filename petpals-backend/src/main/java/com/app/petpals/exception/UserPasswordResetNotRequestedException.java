package com.app.petpals.exception;

public class UserPasswordResetNotRequestedException extends RuntimeException {
    public UserPasswordResetNotRequestedException(String message) {
        super(message);
    }
}