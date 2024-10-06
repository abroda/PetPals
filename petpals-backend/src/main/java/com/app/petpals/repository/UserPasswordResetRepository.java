package com.app.petpals.repository;

import com.app.petpals.entity.User;
import com.app.petpals.entity.UserPasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPasswordResetRepository extends JpaRepository<UserPasswordReset, String> {
    Optional<UserPasswordReset> findByUser(User user);
}
