package com.app.petpals.exception.account;

public class UserNoEditFieldsException extends RuntimeException {
    public UserNoEditFieldsException(String message) {
        super(message);
    }
}