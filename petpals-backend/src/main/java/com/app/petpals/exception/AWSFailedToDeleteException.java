package com.app.petpals.exception;

public class AWSFailedToDeleteException extends RuntimeException {
    public AWSFailedToDeleteException(String message) {
        super(message);
    }
}