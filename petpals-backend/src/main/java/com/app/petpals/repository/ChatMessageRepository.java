package com.app.petpals.repository;

import com.app.petpals.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {
    List<ChatMessage> findByChatroomIdOrderBySentAt(String chatroomId);

    @Query("SELECT m FROM ChatMessage m WHERE m.chatroom.id = :chatroomId ORDER BY m.sentAt DESC")
    Page<ChatMessage> findMessagesByChatroomId(@Param("chatroomId") String chatroomId, Pageable pageable);

    @Query("SELECT m FROM ChatMessage m WHERE m.chatroom.id = :chatroomId ORDER BY m.sentAt DESC LIMIT 1")
    Optional<ChatMessage> findLastMessageByChatroomId(@Param("chatroomId") String chatroomId);
}
