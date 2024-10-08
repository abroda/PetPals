package com.app.petpals.service;

import com.app.petpals.enums.ImageSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ImageServiceFactory {

    private final ImageService databaseImageService;

    @Value("${image.source.type}")
    private ImageSource imageSource;

    public ImageServiceFactory(DatabaseImageService databaseImageService) {
        this.databaseImageService = databaseImageService;
    }

    public ImageService getImageService() {
        switch (imageSource) {
            case DATABASE:
                return databaseImageService;
            case AWS, LOCAL:
                throw new IllegalArgumentException(imageSource + " is not implemented yet.");
            default:
                throw new IllegalArgumentException("Unsupported image source type: " + imageSource);
        }
    }
}
