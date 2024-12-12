package com.app.petpals.service;

import com.app.petpals.entity.Chatroom;
import com.app.petpals.entity.User;
import com.app.petpals.exception.chat.ChatroomDataException;
import com.app.petpals.exception.chat.ChatroomNotFoundException;
import com.app.petpals.payload.chat.ChatroomParticipant;
import com.app.petpals.payload.chat.ChatroomResponse;
import com.app.petpals.repository.ChatMessageRepository;
import com.app.petpals.repository.ChatroomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatroomService {

    private final ChatroomRepository chatroomRepository;
    private final UserService userService;
    private final AWSImageService awsImageService;

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
            return ChatroomResponse.builder()
                    .chatroomId(chatroom.getId())
                    .participants(chatroom.getUsers().stream().map((participant) -> ChatroomParticipant.builder()
                                    .id(participant.getId())
                                    .username(participant.getDisplayName())
                                    .imageUrl(Optional.ofNullable(participant.getProfilePictureId())
                                            .map(awsImageService::getPresignedUrl)
                                            .orElse(null))
                                    .build())
                            .collect(Collectors.toList()))
                    .build();
        } else {
            Chatroom chatroom = new Chatroom();
            chatroom.setCreatedAt(LocalDateTime.now());
            chatroom.setUsers(users);
            Chatroom savedChatroom = chatroomRepository.save(chatroom);
            return ChatroomResponse.builder()
                    .chatroomId(savedChatroom.getId())
                    .participants(savedChatroom.getUsers().stream().map((participant) -> ChatroomParticipant.builder()
                            .id(participant.getId())
                            .username(participant.getDisplayName())
                            .imageUrl(Optional.ofNullable(participant.getProfilePictureId())
                                    .map(awsImageService::getPresignedUrl)
                                    .orElse(null))
                            .build()).collect(Collectors.toList()))
                    .build();
        }
    }

    public List<ChatroomResponse> getAllChatroomsForUser(String userId) {
        User user = userService.getById(userId);
        List<Chatroom> chatrooms = chatroomRepository.findChatroomsByUser(user);

        List<ChatroomResponse> chatroomResponses = new ArrayList<>();
        chatrooms.forEach(chatroom -> {
            chatroomResponses.add(ChatroomResponse.builder()
                    .chatroomId(chatroom.getId())
                    .participants(chatroom.getUsers().stream().map((participant) -> ChatroomParticipant.builder()
                            .id(participant.getId())
                            .username(participant.getDisplayName())
                            .imageUrl(Optional.ofNullable(participant.getProfilePictureId())
                                    .map(awsImageService::getPresignedUrl)
                                    .orElse(null))
                            .build()).collect(Collectors.toList()))
                    .build());
        });

        return chatroomResponses;
    }

    public void deleteChatroom(String chatId) {
        Chatroom chatroom = chatroomRepository.findById(chatId).orElseThrow(() -> new ChatroomNotFoundException("Chatroom not found."));
        chatroomRepository.delete(chatroom);
    }
}
