package com.app.petpals.exception;

public class UserVerificationCodeInvalidException extends RuntimeException {
    public UserVerificationCodeInvalidException(String message) {
        super(message);
    }
}
