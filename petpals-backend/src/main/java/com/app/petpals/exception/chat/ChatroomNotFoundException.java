package com.app.petpals.exception.chat;

public class ChatroomNotFoundException extends RuntimeException {
  public ChatroomNotFoundException(String message) {
    super(message);
  }
}
