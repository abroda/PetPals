package com.app.petpals.service;

import com.app.petpals.exception.AWSFailedToDeleteException;
import com.app.petpals.exception.AWSGetImageException;
import com.app.petpals.exception.AWSPresignUrlException;
import com.app.petpals.exception.AWSUploadImageException;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.time.Duration;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Component
public class AWSImageService {
    private final S3Client s3Client;
    private final String bucketName;
    private final S3Presigner s3Presigner;
    private final Cache<String, String> preSignedUrlCache;


    public AWSImageService(@Value("${aws.s3.bucket.name}") String bucketName,
                           @Value("${aws.s3.key.access}") String accessKey,
                           @Value("${aws.s3.key.secret}") String secretKey,
                           @Value("${aws.s3.session.token}") String sessionToken) {


        this.bucketName = bucketName;
        if (sessionToken != null) {
            this.s3Client = S3Client.builder()
                    .region(Region.US_EAST_1)
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsSessionCredentials.create(accessKey, secretKey, sessionToken)))
                    .build();
            this.s3Presigner = S3Presigner.builder()
                    .region(Region.US_EAST_1)
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsSessionCredentials.create(accessKey, secretKey, sessionToken)))
                    .build();
        } else {
            this.s3Client = S3Client.builder()
                    .region(Region.US_EAST_1)
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKey, secretKey)))
                    .build();
            this.s3Presigner = S3Presigner.builder()
                    .region(Region.US_EAST_1)
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKey, secretKey)))
                    .build();
        }

        this.preSignedUrlCache = Caffeine.newBuilder()
                .expireAfterWrite(15, TimeUnit.MINUTES)
                .maximumSize(10_000)
                .build();

    }

    public byte[] getImage(String id) {
        try {
            // Create a GetObjectRequest
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(id)  // 'id' is the key of the image in the bucket
                    .build();

            ResponseBytes<GetObjectResponse> objectBytes = s3Client.getObjectAsBytes(getObjectRequest);
            return objectBytes.asByteArray();
        } catch (S3Exception e) {
            throw new AWSGetImageException(e.awsErrorDetails().errorMessage());
        }
    }

    public String uploadImage(byte[] imageData, String fileType) {
        try {
            String imageFileName = UUID.randomUUID().toString();

            InputStream imageInputStream = new ByteArrayInputStream(imageData);

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(imageFileName)
                    .contentType(fileType)
                    .build();

            PutObjectResponse response = s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(imageInputStream, imageData.length));
            return imageFileName;
        } catch (S3Exception e){
            throw new AWSUploadImageException(e.awsErrorDetails().errorMessage());
        }

    }

    public String getPresignedUrl(String id) {
        if (id == null) return null;
        return preSignedUrlCache.get(id, this::generatePresignedUrl);
    }

    private String generatePresignedUrl(String id) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(id)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .getObjectRequest(getObjectRequest)
                    .signatureDuration(Duration.ofMinutes(15))
                    .build();

            return s3Presigner.presignGetObject(presignRequest).url().toString();

        } catch (S3Exception e) {
            throw new AWSPresignUrlException(e.awsErrorDetails().errorMessage());
        }
    }

    public void deleteImage(String id) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(id)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
            preSignedUrlCache.invalidate(id);
        } catch (S3Exception e) {
            throw new AWSFailedToDeleteException("Failed to delete file from S3: " + e.getMessage());
        }
    }

}
