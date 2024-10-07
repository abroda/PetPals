package com.app.petpals.repository;

import com.app.petpals.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByUsername(String username);

    List<User> findByUsernameContaining(String email);

    List<User> findByDisplayNameContaining(String displayName);
}