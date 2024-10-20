package com.app.petpals.exception;

public class FriendshipRequestNotFoundException extends RuntimeException {
    public FriendshipRequestNotFoundException(String message) {
        super(message);
    }
}
