package com.app.petpals.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_message")
@Data
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "content")
    private String content;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @ManyToOne()
    @JoinColumn(name = "chat_id", nullable = false)
    private Chatroom chatroom;

    @ManyToOne()
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
}
