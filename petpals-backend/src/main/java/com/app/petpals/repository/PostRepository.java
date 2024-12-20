package com.app.petpals.repository;

import com.app.petpals.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PostRepository extends JpaRepository<Post, String> {
    long countByCreatedAtAfter(LocalDateTime time);
}
