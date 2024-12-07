package com.app.petpals.service;

import com.app.petpals.entity.ChatMessage;
import com.app.petpals.entity.Chatroom;
import com.app.petpals.entity.User;
import com.app.petpals.payload.chat.MessageRequest;
import com.app.petpals.payload.chat.MessageResponse;
import com.app.petpals.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatroomMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatroomService chatroomService;
    private final UserService userService;

    public List<ChatMessage> getChatroomMessagesByChatroomId(String chatroomId) {
        return chatMessageRepository.findByChatroomIdOrderBySentAt(chatroomId);
    }

    public Page<ChatMessage> getChatroomMessagesByChatroomId(String chatroomId, Pageable pageable) {
        chatroomService.getChatroomById(chatroomId);
        return chatMessageRepository.findMessagesByChatroomId(chatroomId, pageable);
    }

    public ChatMessage addChatroomMessage(MessageRequest request) {
        Chatroom chatroom = chatroomService.getChatroomById(request.getChatroomId());
        User sender = userService.getById(request.getSenderId());

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setChatroom(chatroom);
        chatMessage.setSender(sender);
        chatMessage.setContent(request.getContent());
        chatMessage.setSentAt(LocalDateTime.now());

        return chatMessageRepository.save(chatMessage);
    }

    public MessageResponse createMessageResponse(ChatMessage chatMessage) {
        return MessageResponse.builder()
                .content(chatMessage.getContent())
                .sendAt(chatMessage.getSentAt())
                .senderId(chatMessage.getSender().getId())
                .build();
    }
}
