package com.app.petpals.repository;

import com.app.petpals.entity.User;
import com.app.petpals.entity.UserProfileDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileDetailsRepository extends JpaRepository<UserProfileDetails, String> {
    Optional<UserProfileDetails> findByUser(User user);
}
