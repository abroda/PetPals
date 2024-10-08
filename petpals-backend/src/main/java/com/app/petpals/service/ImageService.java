package com.app.petpals.service;

public interface ImageService {
    byte[] getImage(String id);
    void uploadImage(byte[] imageData);
}
