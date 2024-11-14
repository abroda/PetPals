package com.app.petpals.exception.account;

public class UserPasswordResetNotRequestedException extends RuntimeException {
    public UserPasswordResetNotRequestedException(String message) {
        super(message);
    }
}