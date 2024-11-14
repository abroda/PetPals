package com.app.petpals.exception.aws;

public class AWSPresignUrlException extends RuntimeException {
    public AWSPresignUrlException(String message) {
        super(message);
    }
}
