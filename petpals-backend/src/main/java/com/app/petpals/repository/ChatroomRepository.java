package com.app.petpals.repository;

import com.app.petpals.entity.Chatroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatroomRepository extends JpaRepository<Chatroom, String> {
    @Query("SELECT c FROM Chatroom c JOIN c.users u1 JOIN c.users u2 " +
            "WHERE u1.id = :user1Id AND u2.id = :user2Id")
    Optional<Chatroom> findChatroomBetweenUsers(String user1Id, String user2Id);

    @Query("SELECT c FROM Chatroom c " +
            "JOIN c.users u " +
            "WHERE c.id IN (" +
            "   SELECT c2.id FROM Chatroom c2 " +
            "   JOIN c2.users u2 " +
            "   WHERE u2.id IN :userIds " +
            "   GROUP BY c2.id " +
            "   HAVING COUNT(u2.id) = :size" +
            ") " +
            "GROUP BY c.id " +
            "HAVING COUNT(u.id) = :size")
    Optional<Chatroom> findChatroomWithExactUsers(@Param("userIds") List<String> userIds, @Param("size") long size);
}
