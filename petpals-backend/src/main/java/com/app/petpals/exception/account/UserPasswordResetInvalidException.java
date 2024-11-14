package com.app.petpals.exception.account;

public class UserPasswordResetInvalidException extends RuntimeException {
    public UserPasswordResetInvalidException(String message) {
        super(message);
    }
}