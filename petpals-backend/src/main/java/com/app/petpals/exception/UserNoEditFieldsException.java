package com.app.petpals.exception;

public class UserNoEditFieldsException extends RuntimeException {
    public UserNoEditFieldsException(String message) {
        super(message);
    }
}