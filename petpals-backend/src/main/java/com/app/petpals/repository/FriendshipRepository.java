package com.app.petpals.repository;

import com.app.petpals.entity.Friendship;
import com.app.petpals.enums.FriendshipRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, String> {
    Optional<Friendship> findBySenderIdAndReceiverId(String senderId, String receiverId);

    @Query("SELECT CASE " +
            "WHEN f.sender.id = :userId THEN f.receiver.id " +
            "WHEN f.receiver.id = :userId THEN f.sender.id " +
            "END " +
            "FROM Friendship f " +
            "WHERE (f.sender.id = :userId OR f.receiver.id = :userId) " +
            "AND f.status = :status")
    List<String> findOtherUserIdsByUserIdAndStatus(@Param("userId") String userId,
                                                   @Param("status") FriendshipRequestStatus status);
}
