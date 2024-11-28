package com.app.petpals.service;

import com.app.petpals.entity.Dog;
import com.app.petpals.entity.User;
import com.app.petpals.entity.WalkSession;
import com.app.petpals.repository.DogRepository;
import com.app.petpals.repository.WalkSessionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WalkSessionService {
    private final UserService userService;
    private final WalkSessionRepository walkSessionRepository;

    @Transactional
    public String startWalk(String userId, LocalDateTime startTime, List<Dog> dogs) {
        User user = userService.getById(userId);
        WalkSession session = new WalkSession();
        session.setUser(user);
        session.setStartTime(startTime);
        session.setDistance(BigDecimal.valueOf(0.0));
        session.setDogs(dogs);
        WalkSession savedSession = walkSessionRepository.save(session);
        return savedSession.getId();
    }

    public void endWalk(String sessionId, LocalDateTime endTime, double totalDistance) {
        WalkSession session = walkSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));
        session.setEndTime(endTime);
        session.setDistance(BigDecimal.valueOf(totalDistance));
        walkSessionRepository.save(session);
    }

    public WalkSession findActiveSessionByUserId(String userId) {
        return walkSessionRepository.findFirstByUserIdAndEndTimeIsNullOrderByStartTimeDesc(userId)
                .orElse(null);
    }
}
