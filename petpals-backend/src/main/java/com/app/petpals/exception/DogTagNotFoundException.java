package com.app.petpals.exception;

public class DogTagNotFoundException extends RuntimeException {
    public DogTagNotFoundException(String message) {
        super(message);
    }
}
