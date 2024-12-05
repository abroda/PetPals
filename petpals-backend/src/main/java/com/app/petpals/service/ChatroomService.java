package com.app.petpals.service;

import com.app.petpals.entity.ChatMessage;
import com.app.petpals.entity.Chatroom;
import com.app.petpals.entity.User;
import com.app.petpals.exception.chat.ChatroomDataException;
import com.app.petpals.payload.chat.ChatMessageDTO;
import com.app.petpals.payload.chat.ChatroomResponse;
import com.app.petpals.repository.ChatMessageRepository;
import com.app.petpals.repository.ChatroomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ChatroomService {

    private final ChatroomRepository chatroomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserService userService;

    @Transactional
    public ChatroomResponse getOrCreateChatroom(List<String> userIds) {
        if (userIds.size() <= 1) {
            throw new ChatroomDataException("Chatroom requires at least two participants.");
        }
        Set<User> users = new HashSet<>();
        userIds.forEach(userId -> {
            User user = userService.getById(userId);
            users.add(user);
        });

        Optional<Chatroom> chatroomOptional = chatroomRepository.findChatroomWithExactUsers(userIds, userIds.size());
        if (chatroomOptional.isPresent()) {
            return ChatroomResponse.builder().chatroomId(chatroomOptional.get().getId()).build();
        } else {
            Chatroom chatroom = new Chatroom();
            chatroom.setCreatedAt(LocalDateTime.now());

            chatroom.setUsers(users);
            Chatroom savedChatroom = chatroomRepository.save(chatroom);
//            savedChatroomusers.forEach(user -> {
//                user.getChats().add(savedChatroom);
//            });
            return ChatroomResponse.builder().chatroomId(savedChatroom.getId()).build();
        }
    }

    public void saveMessage(ChatMessageDTO messageDTO) {
        Chatroom chatroom = chatroomRepository.findById(messageDTO.getChatroomId())
                .orElseThrow(() -> new IllegalArgumentException("Chatroom not found"));

        User sender = userService.getById(messageDTO.getSenderId());

        ChatMessage message = new ChatMessage();
        message.setChatroom(chatroom);
        message.setSender(sender);
        message.setContent(messageDTO.getContent());
        message.setSentAt(LocalDateTime.now());

        chatMessageRepository.save(message);
    }

    public List<ChatMessage> getChatMessages(String chatroomId) {
        return chatMessageRepository.findByChatroomIdOrderBySentAt(chatroomId);
    }

//    public Set<Chatroom> getChatroomIdsForUser(String userId) {
//        User user = userService.getById(userId);
//        return user.getChats();
//    }

//    public void saveMessage(ChatMessageDTO messageDTO) {
//        Chatroom chatroom = chatroomRepository.findById(messageDTO.getChatroomId())
//                .orElseThrow(() -> new IllegalArgumentException("Chatroom not found."));
//
//        User sender = userService.getById(messageDTO.getSenderId());
//
//        ChatMessage message = new ChatMessage();
//        message.setChatroom(chatroom);
//        message.setSender(sender);
//        message.setContent(messageDTO.getContent());
//        message.setSentAt(LocalDateTime.now());
//
//        chatMessageRepository.save(message);
//    }

//    public Chatroom getOrCreateChatroom(String user1Id, String user2Id) {
//        // Check if a chatroom between these two users already exists
//        Optional<Chatroom> existingChatroom = chatroomRepository.findPrivateChatroom(user1Id, user2Id);
//        if (existingChatroom.isPresent()) {
//            return existingChatroom.get();
//        }
//
//        // Create a new chatroom
//        Chatroom newChatroom = new Chatroom();
//        newChatroom.setCreatedAt(LocalDateTime.now());
//        chatroomRepository.save(newChatroom);
//
//        // Add both users to the chatroom
//        User user1 = userService.getById(user1Id);
//        user1.getChats().add(newChatroom);
//        User user2 = userService.getById(user1Id);
//        user2.getChats().add(newChatroom);
//        userRepository.save(user1);
//        userRepository.save(user2);
//
//        return newChatroom;
//    }
}
