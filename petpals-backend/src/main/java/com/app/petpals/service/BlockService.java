package com.app.petpals.service;

import com.app.petpals.entity.Friendship;
import com.app.petpals.entity.User;
import com.app.petpals.exception.UserDataException;
import com.app.petpals.exception.UserNotFoundException;
import com.app.petpals.repository.FriendshipRepository;
import com.app.petpals.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BlockService {
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;

    @Transactional
    public void blockUser(String blockerId, String blockedId) {
        if (Objects.equals(blockerId, blockedId)) {
            throw new UserDataException("You can't block yourself.");
        }

        User blocker = userRepository.findById(blockerId)
                .orElseThrow(() -> new UserNotFoundException("Blocker not found."));

        User blocked = userRepository.findById(blockedId)
                .orElseThrow(() -> new UserNotFoundException("Blocked user not found."));

        if (blocker.getBlockedUsers().contains(blocked)) {
            throw new UserDataException("User already blocked.");
        }

        blocker.getFriends().remove(blocked);
        blocked.getFriends().remove(blocker);

        Optional<Friendship> friendshipRequest = friendshipRepository
                .findBySenderIdAndReceiverId(blockerId, blockedId)
                .or(() -> friendshipRepository.findBySenderIdAndReceiverId(blockedId, blockerId));

        friendshipRequest.ifPresent(friendshipRepository::delete);

        blocker.getBlockedUsers().add(blocked);
        userRepository.save(blocker);
        userRepository.save(blocked);
    }

    @Transactional
    public void unblockUser(String blockerId, String blockedId) {
        if (Objects.equals(blockerId, blockedId)) {
            throw new UserDataException("You can't unblock yourself.");
        }

        User blocker = userRepository.findById(blockerId)
                .orElseThrow(() -> new UserNotFoundException("Blocker not found."));

        User blocked = userRepository.findById(blockedId)
                .orElseThrow(() -> new UserNotFoundException("Blocked user not found."));

        if (!blocker.getBlockedUsers().contains(blocked)) {
            throw new IllegalArgumentException("User is not blocked.");
        }

        blocker.getBlockedUsers().remove(blocked);
        userRepository.save(blocker);
    }

    public boolean isBlocked(String blockerId, String blockedId) {
        if (Objects.equals(blockerId, blockedId)) {
            throw new UserDataException("You can't be blocked by yourself.");
        }

        User blocker = userRepository.findById(blockerId)
                .orElseThrow(() -> new UserNotFoundException("Blocker not found."));

        User blocked = userRepository.findById(blockedId)
                .orElseThrow(() -> new UserNotFoundException("Blocked user not found."));

        return blocker.getBlockedUsers().contains(blocked);
    }
}
