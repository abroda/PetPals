package com.app.petpals.exception;

public class UserVerificationCodeExpiredException extends RuntimeException {
    public UserVerificationCodeExpiredException(String message) {
        super(message);
    }
}