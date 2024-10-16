package com.app.petpals.service;

import com.app.petpals.exception.*;
import com.app.petpals.payload.RegisterRequest;
import com.app.petpals.payload.AuthenticationRequest;
import com.app.petpals.payload.VerifyUserRequest;
import com.app.petpals.repository.UserRepository;
import com.app.petpals.entity.User;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public User register(RegisterRequest registerRequest) throws MessagingException {
        User user = new User(
                registerRequest.getEmail(),
                registerRequest.getDisplayName(),
                passwordEncoder.encode(registerRequest.getPassword())
        );
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationExpiration(LocalDateTime.now().plusMinutes(15));
        user.setEnabled(false);
        sendVerificationEmail(user);
        return userRepository.save(user);
    }

    public User authenticate(AuthenticationRequest authenticationRequest) {
        User user = userRepository.findByUsername(authenticationRequest.getEmail()).orElseThrow(() -> new UserNotFoundException("User not found."));
        if (!user.isEnabled()) throw new UserNotVerifiedException("User is not verified. Please verify your account.");

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                authenticationRequest.getEmail(),
                authenticationRequest.getPassword()
        ));
        return user;
    }

    public void verifyUser(VerifyUserRequest verifyRequest) {
        Optional<User> optionalUser = userRepository.findByUsername(verifyRequest.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.isEnabled()) throw new UserAlreadyVerifiedException("User is already verified.");
            if (user.getVerificationExpiration().isBefore(LocalDateTime.now())) {
                throw new UserVerificationCodeExpiredException("Verification code has expired.");
            }
            if (user.getVerificationCode().equals(verifyRequest.getVerificationCode())) {
                user.setEnabled(true);
                user.setVerificationCode(null);
                user.setVerificationExpiration(null);
                userRepository.save(user);
            } else {
                throw new UserVerificationCodeInvalidException("Invalid verification code.");
            }
        } else {
            throw new UserNotFoundException("User not found.");
        }
    }

    public void resendVerificationCode(String email) throws MessagingException {
        Optional<User> optionalUser = userRepository.findByUsername(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.isEnabled()) {
                throw new UserAlreadyVerifiedException("User is already verified.");
            } else {
                user.setVerificationCode(generateVerificationCode());
                user.setVerificationExpiration(LocalDateTime.now().plusMinutes(15));
                sendVerificationEmail(user);
                userRepository.save(user);
            }
        } else {
            throw new UserNotFoundException("User not found.");
        }
    }

    public void sendVerificationEmail(User user) throws MessagingException {
        String subject = "PetPals account verification";
        String verificationCode = user.getVerificationCode();
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

            emailService.sendVerificationMail(user.getUsername(), subject, htmlMessage);
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }

}