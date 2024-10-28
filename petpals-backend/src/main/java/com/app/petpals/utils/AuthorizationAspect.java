package com.app.petpals.utils;

import com.app.petpals.entity.User;
import com.app.petpals.exception.UserUnauthorizedException;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Aspect
@Component
public class AuthorizationAspect {

    @Value("${environment.type}")
    private String environmentType;  // Inject your environment type from application properties

    @Before("@annotation(CheckUserAuthorization) && args(id, ..)")
    public void checkUserAuthorization(JoinPoint joinPoint, String id) throws Throwable {
        if (Objects.equals(environmentType, "PROD")) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth == null || !(auth.getPrincipal() instanceof User authUser)) {
                throw new UserUnauthorizedException("Unauthorized action.");
            }

            if (!Objects.equals(authUser.getId(), id)) {
                throw new UserUnauthorizedException("Unauthorized action.");
            }
        }
    }
}
