package com.app.petpals.exception.aws;

public class AWSFailedToDeleteException extends RuntimeException {
    public AWSFailedToDeleteException(String message) {
        super(message);
    }
}