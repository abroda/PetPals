package com.app.petpals.service;

import com.app.petpals.entity.Image;
import com.app.petpals.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;


@Component
@RequiredArgsConstructor
public class DatabaseImageService implements ImageService {
    private final ImageRepository imageRepository;

    @Override
    public byte[] getImage(String id) {
        Optional<Image> optionalImage = imageRepository.findById(id);
        if (optionalImage.isPresent()) {
            Image image = optionalImage.get();
            return image.getImage();
        } else {
            throw new RuntimeException("Image not found");
        }
    }

    @Override
    public void uploadImage(byte[] imageData) {
        Image image = new Image();
        image.setImage(imageData);
        imageRepository.save(image);
    }
}
