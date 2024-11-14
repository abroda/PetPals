package com.app.petpals.exception.account;

public class UserVerificationCodeExpiredException extends RuntimeException {
    public UserVerificationCodeExpiredException(String message) {
        super(message);
    }
}