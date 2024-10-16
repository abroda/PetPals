package com.app.petpals.exception;

public class AWSPresignUrlException extends RuntimeException {
    public AWSPresignUrlException(String message) {
        super(message);
    }
}
