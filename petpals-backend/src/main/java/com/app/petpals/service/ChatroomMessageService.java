package com.app.petpals.service;

import com.app.petpals.entity.ChatMessage;
import com.app.petpals.entity.Chatroom;
import com.app.petpals.entity.User;
import com.app.petpals.payload.chat.ChatroomParticipant;
import com.app.petpals.payload.chat.LatestMessageResponse;
import com.app.petpals.payload.chat.MessageRequest;
import com.app.petpals.payload.chat.MessageResponse;
import com.app.petpals.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatroomMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatroomService chatroomService;
    private final UserService userService;
    private final AWSImageService awsImageService;

    public List<ChatMessage> getChatroomMessagesByChatroomId(String chatroomId) {
        return chatMessageRepository.findByChatroomIdOrderBySentAt(chatroomId);
    }

    public Page<ChatMessage> getChatroomMessagesByChatroomId(String chatroomId, Pageable pageable) {
        chatroomService.getChatroomById(chatroomId);
        return chatMessageRepository.findMessagesByChatroomId(chatroomId, pageable);
    }

    public List<LatestMessageResponse> getLatestChatroomMessages(List<String> chatroomIds) {
        List<LatestMessageResponse> lastMessages = new ArrayList<>();
        chatroomIds.stream().forEach(chatroomId -> {
            chatroomService.getChatroomById(chatroomId);
            ChatMessage chatMessage = chatMessageRepository.findLastMessageByChatroomId(chatroomId).orElse(null);
            lastMessages.add(LatestMessageResponse.builder()
                    .chatroomId(chatroomId)
                    .latestMessage(chatMessage != null ? MessageResponse.builder()
                            .sender(ChatroomParticipant.builder()
                                    .id(chatMessage.getSender().getId())
                                    .username(chatMessage.getSender().getDisplayName())
                                    .imageUrl(Optional.ofNullable(chatMessage.getSender().getProfilePictureId())
                                            .map(awsImageService::getPresignedUrl)
                                            .orElse(null))
                                    .build())
                            .sendAt(chatMessage.getSentAt().toString())
                            .content(chatMessage.getContent())
                            .build() : null)
                    .build());
        });
        return lastMessages;
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
                .sendAt(chatMessage.getSentAt().toString())
                .sender(ChatroomParticipant.builder()
                        .id(chatMessage.getSender().getId())
                        .username(chatMessage.getSender().getDisplayName())
                        .imageUrl(Optional.ofNullable(chatMessage.getSender().getProfilePictureId())
                                .map(awsImageService::getPresignedUrl)
                                .orElse(null))
                        .build())
                .build();
    }
}
