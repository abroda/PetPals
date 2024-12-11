package com.app.petpals.service;

import com.app.petpals.entity.Friendship;
import com.app.petpals.entity.User;
import com.app.petpals.enums.FriendshipRequestStatus;
import com.app.petpals.exception.account.FriendshipRequestDataException;
import com.app.petpals.exception.account.FriendshipRequestNotFoundException;
import com.app.petpals.exception.account.UserDataException;
import com.app.petpals.exception.account.UserNotFoundException;
import com.app.petpals.repository.FriendshipRepository;
import com.app.petpals.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FriendshipService {
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final UserService userService;

    public List<String> getAcceptedFriendshipsForUser(String userId) {
        return friendshipRepository.findOtherUserIdsByUserIdAndStatus(userId, FriendshipRequestStatus.ACCEPTED);
    }

    public boolean checkIfUsersAreFriends(String userId, String friendId){
        User user = userService.getById(userId);
        User friend = userService.getById(friendId);
        return user.getFriends().contains(friend) && friend.getFriends().contains(user);
    }

    @Transactional
    public void sendFriendRequest(String senderId, String receiverId) {
        if (Objects.equals(senderId, receiverId)) {
            throw new UserDataException("You can't request friendship with yourself.");
        }

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
    public void removePendingFriendRequest(String requestId) {
        Optional<Friendship> requestOptional = friendshipRepository.findById(requestId);

        if (requestOptional.isPresent()) {
            Friendship request = requestOptional.get();
            if (request.getStatus() != FriendshipRequestStatus.PENDING) {
                throw new FriendshipRequestDataException("Only pending requests can be removed.");
            }
            friendshipRepository.delete(request);
        } else {
            throw new FriendshipRequestNotFoundException("Friend request not found.");
        }
    }

    @Transactional
    public void removeFriend(String userId, String friendId) {
        if (Objects.equals(userId, friendId)) {
            throw new UserDataException("You can't unfriend yourself.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new UserNotFoundException("Friend not found."));

        if (user.getFriends().contains(friend)) {

            user.getFriends().remove(friend);
            friend.getFriends().remove(user);
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

    @Transactional
    public List<Friendship> getFriendRequestsForUser(String userId) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            // Fetch all requests where the user is the sender or receiver
            return friendshipRepository.findAllBySenderIdOrReceiverId(userId, userId);
        } else {
            throw new UserNotFoundException("User not found.");
        }
    }

}
