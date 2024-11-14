package com.app.petpals.exception.account;

public class UserPasswordResetExpiredException extends RuntimeException {
    public UserPasswordResetExpiredException(String message) {
        super(message);
    }
}