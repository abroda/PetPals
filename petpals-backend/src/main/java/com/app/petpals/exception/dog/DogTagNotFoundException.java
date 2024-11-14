package com.app.petpals.exception.dog;

public class DogTagNotFoundException extends RuntimeException {
    public DogTagNotFoundException(String message) {
        super(message);
    }
}
