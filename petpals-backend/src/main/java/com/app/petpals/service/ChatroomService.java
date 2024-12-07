package com.app.petpals.service;

import com.app.petpals.entity.ChatMessage;
import com.app.petpals.entity.Chatroom;
import com.app.petpals.entity.User;
import com.app.petpals.exception.chat.ChatroomDataException;
import com.app.petpals.exception.chat.ChatroomNotFoundException;
import com.app.petpals.payload.chat.MessageRequest;
import com.app.petpals.payload.chat.ChatroomResponse;
import com.app.petpals.payload.chat.MessageResponse;
import com.app.petpals.repository.ChatMessageRepository;
import com.app.petpals.repository.ChatroomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatroomService {

    private final ChatroomRepository chatroomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserService userService;

    public Chatroom getChatroomById(String id) {
        return chatroomRepository.findById(id).orElseThrow(() -> new ChatroomNotFoundException("Chatroom not found."));
    }

    @Transactional
    public ChatroomResponse getOrCreateChatroom(List<String> userIds) {
        if (userIds.size() <= 1) {
            throw new ChatroomDataException("Chatroom requires at least two participants.");
        }
        List<User> users = new ArrayList<>();
        userIds.forEach(userId -> {
            User user = userService.getById(userId);
            users.add(user);
        });

        Optional<Chatroom> chatroomOptional = chatroomRepository.findChatroomWithExactUsers(userIds, userIds.size());
        if (chatroomOptional.isPresent()) {
            Chatroom chatroom = chatroomOptional.get();
            ChatMessage chatMessage = chatMessageRepository.findLastMessageByChatroomId(chatroom.getId()).orElse(null);

            return ChatroomResponse.builder()
                    .chatroomId(chatroom.getId())
                    .participants(chatroom.getUsers().stream().map(User::getId).collect(Collectors.toList()))
                    .lastMessage(chatMessage != null ? MessageResponse.builder()
                            .content(chatMessage.getContent())
                            .sendAt(chatMessage.getSentAt())
                            .senderId(chatMessage.getSender().getId())
                            .build() : null)
                    .build();
        } else {
            Chatroom chatroom = new Chatroom();
            chatroom.setCreatedAt(LocalDateTime.now());

            chatroom.setUsers(users);
            Chatroom savedChatroom = chatroomRepository.save(chatroom);
            return ChatroomResponse.builder()
                    .chatroomId(savedChatroom.getId())
                    .participants(savedChatroom.getUsers().stream().map(User::getId).collect(Collectors.toList()))
                    .lastMessage(null)
                    .build();
        }
    }

    public List<ChatroomResponse> getAllChatroomsForUser(String userId) {
        User user = userService.getById(userId);
        List<Chatroom> chatrooms = chatroomRepository.findChatroomsByUser(user);

        List<ChatroomResponse> chatroomResponses = new ArrayList<>();
        chatrooms.forEach(chatroom -> {
            ChatMessage chatMessage = chatMessageRepository.findLastMessageByChatroomId(chatroom.getId()).orElse(null);
            chatroomResponses.add(ChatroomResponse.builder()
                    .chatroomId(chatroom.getId())
                    .participants(chatroom.getUsers().stream().map(User::getId).collect(Collectors.toList()))
                    .lastMessage(chatMessage != null ? MessageResponse.builder()
                            .content(chatMessage.getContent())
                            .sendAt(chatMessage.getSentAt())
                            .senderId(chatMessage.getSender().getId())
                            .build() : null)
                    .build());
        });

        return chatroomResponses;
    }

    public void deleteChatroom(String chatId){
        Chatroom chatroom = chatroomRepository.findById(chatId).orElseThrow(() -> new ChatroomNotFoundException("Chatroom not found."));
        chatroomRepository.delete(chatroom);
    }

    public void saveMessage(MessageRequest messageDTO) {
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
