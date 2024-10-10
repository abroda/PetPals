package com.app.petpals.service;

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

@Component
public class AWSImageService implements ImageService {
    private final S3Client s3Client;
    private final String bucketName;
    private final S3Presigner s3Presigner;

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

    }

    @Override
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
            throw new RuntimeException(e.awsErrorDetails().errorMessage());
        }
    }

    @Override
    public void uploadImage(byte[] imageData) {
        // Generate a UUID for the filename
        String imageFileName = UUID.randomUUID().toString() + ".jpg"; // You can change the extension based on your image type

        // Convert byte array to InputStream
        InputStream imageInputStream = new ByteArrayInputStream(imageData);

        // Create the PutObjectRequest for uploading to S3
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName) // Your S3 bucket name
                .key(imageFileName)  // Unique UUID filename
                .contentType("image/jpeg") // Adjust content type if needed (image/png, etc.)
                .build();

        // Upload the image to S3
        PutObjectResponse response = s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(imageInputStream, imageData.length));

        // You can handle the response or logging as needed
        System.out.println("Image uploaded successfully. S3 Response: " + response);
    }

    public String generatePresignedUrl(String id) {
        try {
            // Create a GetObjectRequest
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(id)  // The 'id' is the key (filename) of the image in the S3 bucket
                    .build();

            // Create a PresignGetObjectRequest with an expiration time (e.g., 15 minutes)
            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .getObjectRequest(getObjectRequest)
                    .signatureDuration(Duration.ofMinutes(15))  // Set the expiration duration
                    .build();

            // Generate the pre-signed URL
            return s3Presigner.presignGetObject(presignRequest).url().toString();

        } catch (S3Exception e) {
            throw new RuntimeException(e.awsErrorDetails().errorMessage());
        }
    }
}
