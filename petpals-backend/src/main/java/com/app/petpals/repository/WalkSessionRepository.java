package com.app.petpals.repository;

import com.app.petpals.entity.WalkSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalkSessionRepository extends JpaRepository<WalkSession, String> {
    Optional<WalkSession> findFirstByUserIdAndEndTimeIsNullOrderByStartTimeDesc(String userId);
}
