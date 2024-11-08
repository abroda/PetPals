package com.app.petpals.service;

import com.app.petpals.entity.User;
import com.app.petpals.exception.UserDataException;
import com.app.petpals.exception.UserNotFoundException;
import com.app.petpals.payload.AccountEditRequest;
import com.app.petpals.payload.UserResponse;
import com.app.petpals.repository.UserRepository;
import jakarta.transaction.Transactional;
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

    public User getById(String id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            return optionalUser.get();
        } else {
            throw new UserNotFoundException("User not found.");
        }
    }

//    public List<UserResponse> searchUsers(String email, String displayName) {
//        if (email != null && !email.isEmpty()) {
//            return userRepository.findByUsernameContaining(email).stream()
//                    .map(user -> UserResponse.builder()
//                            .email(user.getUsername())
//                            .username(user.getDisplayName())
//                            .build())
//                    .collect(Collectors.toList());
//        } else if (displayName != null && !displayName.isEmpty()) {
//            return userRepository.findByDisplayNameContaining(displayName).stream()
//                    .map(user -> UserResponse.builder()
//                            .email(user.getUsername())
//                            .username(user.getDisplayName())
//                            .build())
//                    .collect(Collectors.toList());
//        } else {
//            return userRepository.findAll().stream()
//                    .map(user -> UserResponse.builder()
//                            .email(user.getUsername())
//                            .username(user.getDisplayName())
//                            .build())
//                    .collect(Collectors.toList());
//        }
//    }

    public User updateUserData(String userId, AccountEditRequest request) {
        User user = getById(userId);
        if (request.getDisplayName() != null && !request.getDisplayName().isEmpty()) {
            user.setDisplayName(request.getDisplayName());
        } else throw new UserDataException("Username can't be null or empty.");

        user.setDescription(request.getDescription());
        if (request.getVisibility() != null) {
            user.setVisibility(request.getVisibility());
        }

        return userRepository.save(user);
    }

    public User updateUserProfilePicture(String userId, String profilePictureId) {
        User user = getById(userId);
        user.setProfilePictureId(profilePictureId);
        return userRepository.save(user);
    }

    public User deleteUserPicture(String userId) {
        User user = getById(userId);
        user.setProfilePictureId(null);
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
