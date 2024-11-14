package com.app.petpals.service;

import com.app.petpals.entity.User;
import com.app.petpals.entity.UserPasswordReset;
import com.app.petpals.exception.account.*;
import com.app.petpals.payload.auth.ConfirmResetPasswordCodeRequest;
import com.app.petpals.payload.auth.CreateResetPasswordCodeRequest;
import com.app.petpals.payload.account.ResetPasswordRequest;
import com.app.petpals.repository.UserPasswordResetRepository;
import com.app.petpals.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserPasswordResetService {
    private final UserPasswordResetRepository userPasswordResetRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public void forgotPassword(CreateResetPasswordCodeRequest createResetPasswordCodeRequest) throws MessagingException {
        Optional<User> optionalUser = userRepository.findByUsername(createResetPasswordCodeRequest.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (!user.isEnabled()) {
                throw new UserNotVerifiedException("This user is not verified yet.");
            }
            Optional<UserPasswordReset> optionalUserPasswordReset = userPasswordResetRepository.findByUser(user);
            UserPasswordReset userPasswordReset;
            if (optionalUserPasswordReset.isPresent()) {
                userPasswordReset = optionalUserPasswordReset.get();
            } else {
                userPasswordReset = new UserPasswordReset();
                userPasswordReset.setUser(user);
            }
            userPasswordReset.setResetCode(generateResetCode());
            userPasswordReset.setResetExpiration(LocalDateTime.now().plusMinutes(5));
            sendResetEmail(user, userPasswordReset);
            userPasswordResetRepository.save(userPasswordReset);
        } else {
            throw new UserNotFoundException("User not found.");
        }
    }

    public void confirmResetCode(ConfirmResetPasswordCodeRequest confirmResetPasswordCodeRequest) {
        Optional<User> optionalUser = userRepository.findByUsername(confirmResetPasswordCodeRequest.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (!user.isEnabled()) {
                throw new UserNotVerifiedException("This user is not verified yet.");
            }
            Optional<UserPasswordReset> optionalUserPasswordReset = userPasswordResetRepository.findByUser(user);
            if (optionalUserPasswordReset.isPresent()) {
                UserPasswordReset userPasswordReset = optionalUserPasswordReset.get();
                if (userPasswordReset.getResetExpiration().isBefore(LocalDateTime.now())) {
                    throw new UserPasswordResetExpiredException("Password reset code has expired.");
                }
                if (!userPasswordReset.getResetCode().equals(confirmResetPasswordCodeRequest.getCode())) {
                    throw new UserPasswordResetInvalidException("Invalid password reset code.");
                }
            } else {
                throw new UserPasswordResetNotRequestedException("No password reset request found for the user.");
            }
        } else {
            throw new UserNotFoundException("User not found.");
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest resetPasswordRequest) {
        Optional<User> optionalUser = userRepository.findByUsername(resetPasswordRequest.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<UserPasswordReset> optionalUserPasswordReset = userPasswordResetRepository.findByUser(user);
            if (optionalUserPasswordReset.isPresent()) {
                UserPasswordReset userPasswordReset = optionalUserPasswordReset.get();
                if (userPasswordReset.getResetExpiration().isBefore(LocalDateTime.now())) {
                    throw new UserPasswordResetExpiredException("Password reset code has expired.");
                }
                if (!userPasswordReset.getResetCode().equals(resetPasswordRequest.getCode())) {
                    throw new UserPasswordResetInvalidException("Invalid password reset code.");
                }
                user.setPassword(passwordEncoder.encode(resetPasswordRequest.getPassword()));
                user.setPasswordReset(null);
                userRepository.save(user);
            } else {
                throw new UserPasswordResetNotRequestedException("No password reset request found for this user.");
            }
        } else throw new UserNotFoundException("User not found.");
    }

    public void sendResetEmail(User user, UserPasswordReset userPasswordReset) throws MessagingException {
        String subject = "PetPals account password reset";
        String resetCode = userPasswordReset.getResetCode();
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Password Reset</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the reset code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Reset Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + resetCode + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";
        emailService.sendPasswordResetMail(user.getUsername(), subject, htmlMessage);
    }

    private String generateResetCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}
