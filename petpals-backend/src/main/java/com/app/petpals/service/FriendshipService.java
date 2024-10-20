package com.app.petpals.service;

import com.app.petpals.entity.Friendship;
import com.app.petpals.entity.User;
import com.app.petpals.enums.FriendshipRequestStatus;
import com.app.petpals.exception.FriendshipRequestDataException;
import com.app.petpals.exception.FriendshipRequestNotFoundException;
import com.app.petpals.exception.UserNotFoundException;
import com.app.petpals.repository.FriendshipRepository;
import com.app.petpals.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FriendshipService {
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;

    @Transactional
    public void sendFriendRequest(String senderId, String receiverId) {
        Optional<User> optionalSender = userRepository.findById(senderId);
        Optional<User> optionalReceiver = userRepository.findById(receiverId);
        if (optionalSender.isPresent() && optionalReceiver.isPresent()) {
            User sender = optionalSender.get();
            User receiver = optionalReceiver.get();

            Optional<Friendship> existingRequest = friendshipRepository.findBySenderIdAndReceiverId(senderId, receiverId);
            if (existingRequest.isPresent()) {
                Friendship friendship = existingRequest.get();
                if (friendship.getStatus() == FriendshipRequestStatus.PENDING) {
                    throw new FriendshipRequestDataException("Friend request already sent.");
                } else if (friendship.getStatus() == FriendshipRequestStatus.ACCEPTED) {
                    throw new FriendshipRequestDataException("Friend request already accepted.");
                }
            }

            Friendship friendshipRequest = existingRequest.orElseGet(Friendship::new);
            friendshipRequest.setSender(sender);
            friendshipRequest.setReceiver(receiver);
            friendshipRequest.setStatus(FriendshipRequestStatus.PENDING);

            friendshipRepository.save(friendshipRequest);
        } else throw new UserNotFoundException("Sender or Receiver not found.");
    }

    @Transactional
    public void acceptFriendRequest(String requestId) {
        Optional<Friendship> requestOptional = friendshipRepository.findById(requestId);
        if (requestOptional.isPresent()) {
            Friendship request = requestOptional.get();
            if (request.getStatus() == FriendshipRequestStatus.ACCEPTED) {
                throw new FriendshipRequestDataException("Friendship request already accepted.");
            } else if (request.getStatus() == FriendshipRequestStatus.DENIED) {
                throw new FriendshipRequestDataException("Friendship request already denied.");
            }
            request.setStatus(FriendshipRequestStatus.ACCEPTED);

            User sender = request.getSender();
            User receiver = request.getReceiver();

            List<User> senderFriends = sender.getFriends();
            senderFriends.add(receiver);
            sender.setFriends(senderFriends);

            List<User> receiverFriends = receiver.getFriends();
            receiverFriends.add(sender);
            receiver.setFriends(receiverFriends);

            userRepository.save(sender);
            userRepository.save(receiver);
            friendshipRepository.save(request);
        } else throw new FriendshipRequestNotFoundException("Friend request not found.");
    }

    @Transactional
    public void denyFriendRequest(String requestId) {
        Optional<Friendship> requestOptional = friendshipRepository.findById(requestId);

        if (requestOptional.isPresent()) {
            Friendship request = requestOptional.get();
            if (request.getStatus() != FriendshipRequestStatus.PENDING) {
                throw new FriendshipRequestDataException("Friendship request was already accepted.");
            }
            request.setStatus(FriendshipRequestStatus.DENIED);
            friendshipRepository.save(request);
        } else throw new FriendshipRequestNotFoundException("Friend request not found.");
    }

    @Transactional
    public void removeFriend(String userId, String friendId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new UserNotFoundException("Friend not found."));

        if (user.getFriends().contains(friend)) {

            user.getFriends().remove(friend);
            friend.getFriends().remove(user);
            System.out.println("HERE!");
            userRepository.save(user);
            userRepository.save(friend);

            Optional<Friendship> friendshipRequest = friendshipRepository
                    .findBySenderIdAndReceiverId(userId, friendId)
                    .or(() -> friendshipRepository.findBySenderIdAndReceiverId(friendId, userId));

            friendshipRequest.ifPresent(friendshipRepository::delete);
        } else {
            throw new FriendshipRequestNotFoundException("Friend relationship does not exist.");
        }
    }
}
