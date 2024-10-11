package com.app.petpals.service;

import com.app.petpals.entity.User;
import com.app.petpals.entity.UserProfileDetails;
import com.app.petpals.payload.AccountEditRequest;
import com.app.petpals.payload.AccountResponse;
import com.app.petpals.payload.UserResponse;
import com.app.petpals.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User getByEmail(String email) {
        Optional<User> optionalUser = userRepository.findByUsername(email);
        if (optionalUser.isPresent()) {
            return optionalUser.get();
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public List<UserResponse> searchUsers(String email, String displayName) {
        if (email != null && !email.isEmpty()) {
            return userRepository.findByUsernameContaining(email).stream()
                    .map(user -> UserResponse.builder()
                            .email(user.getUsername())
                            .username(user.getDisplayName())
                            .userProfileDetails(user.getUserProfileDetails())
                            .build())
                    .collect(Collectors.toList());
        } else if (displayName != null && !displayName.isEmpty()) {
            return userRepository.findByDisplayNameContaining(displayName).stream()
                    .map(user -> UserResponse.builder()
                            .email(user.getUsername())
                            .username(user.getDisplayName())
                            .userProfileDetails(user.getUserProfileDetails())
                            .build())
                    .collect(Collectors.toList());
        } else {
            return userRepository.findAll().stream()
                    .map(user -> UserResponse.builder()
                            .email(user.getUsername())
                            .username(user.getDisplayName())
                            .userProfileDetails(user.getUserProfileDetails())
                            .build())
                    .collect(Collectors.toList());
        }
    }

    public User updateUser(AccountEditRequest request) {
        Optional<User> optionalUser = userRepository.findByUsername(request.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getUserProfileDetails() == null) {
                user.setUserProfileDetails(new UserProfileDetails());
                user.getUserProfileDetails().setUser(user);
            }
            if (request.getDisplayName() != null) {
                user.setDisplayName(request.getDisplayName());
            }
            if (request.getDescription() != null) {
                user.getUserProfileDetails().setDescription(request.getDescription());
            }
            if (request.getImageId() != null) {
                user.getUserProfileDetails().setProfilePictureId(request.getImageId());
            }
            userRepository.save(user);

            return user;
        } else {
            throw new RuntimeException("User not found.");
        }
    }
}
