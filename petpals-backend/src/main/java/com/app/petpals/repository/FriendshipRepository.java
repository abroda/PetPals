package com.app.petpals.repository;

import com.app.petpals.entity.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, String> {
    Optional<Friendship> findBySenderIdAndReceiverId(String senderId, String receiverId);
}
