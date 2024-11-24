package com.app.petpals.service;

import com.app.petpals.entity.User;
import com.app.petpals.entity.WalkSession;
import com.app.petpals.repository.WalkSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WalkSessionService {
    private final UserService userService;
    private final WalkSessionRepository walkSessionRepository;

    public String startWalk(String userId, LocalDateTime startTime) {
        User user = userService.getById(userId);
        WalkSession session = new WalkSession();
        session.setUser(user);
        session.setStartTime(startTime);
        session.setDistance(BigDecimal.valueOf(0.0));
        walkSessionRepository.save(session);
        return session.getId();
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
