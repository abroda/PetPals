package com.app.petpals.exception.account;

public class UserVerificationCodeInvalidException extends RuntimeException {
    public UserVerificationCodeInvalidException(String message) {
        super(message);
    }
}
