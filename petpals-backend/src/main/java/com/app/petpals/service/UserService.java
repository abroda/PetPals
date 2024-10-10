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

    public List<UserResponse> getUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> UserResponse.builder()
                        .email(user.getUsername()) // Assuming email is stored in the username field
                        .username(user.getDisplayName())
                        .userProfileDetails(user.getUserProfileDetails())
                        .build()
                ).collect(Collectors.toList());
    }

    public UserResponse getByEmail(String email) {
        Optional<User> optionalUser = userRepository.findByUsername(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            return UserResponse.builder()
                    .email(user.getUsername())
                    .username(user.getDisplayName())
                    .userProfileDetails(user.getUserProfileDetails())
                    .build();
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

    public AccountResponse updateUser(String email, AccountEditRequest request) {
        Optional<User> optionalUser = userRepository.findByUsername(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getUserProfileDetails() == null) {
                user.setUserProfileDetails(new UserProfileDetails());
                user.getUserProfileDetails().setUser(user);
            }
            user.getUserProfileDetails().setDescription(request.getDescription());

            userRepository.save(user);

            return AccountResponse.builder()
                    .description(request.getDescription())
                    .username(user.getUsername())
                    .build();
        } else {
            throw new RuntimeException("User not found.");
        }
    }
}
