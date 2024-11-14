package com.app.petpals.utils;

import com.app.petpals.entity.User;
import com.app.petpals.exception.account.UserUnauthorizedException;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Objects;

@Aspect
@Component
public class AuthorizationAspect {

    @Value("${environment.type}")
    private String environmentType;

    @Before("@annotation(checkUserAuthorization)")
    public void checkUserAuthorization(JoinPoint joinPoint, CheckUserAuthorization checkUserAuthorization) throws Throwable {
        if (Objects.equals(environmentType, "PROD")) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth == null || !(auth.getPrincipal() instanceof User authUser)) {
                throw new UserUnauthorizedException("Unauthorized action.");
            }

            // Retrieve user ID from the method arguments
            String userId = getUserIdFromArguments(joinPoint, checkUserAuthorization);

            if (!Objects.equals(authUser.getId(), userId)) {
                throw new UserUnauthorizedException("Unauthorized action.");
            }
        }
    }

    private String getUserIdFromArguments(JoinPoint joinPoint, CheckUserAuthorization checkUserAuthorization) throws IllegalAccessException {
        Object[] args = joinPoint.getArgs();
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        Annotation[][] parameterAnnotations = method.getParameterAnnotations();

        String pathVariableName = checkUserAuthorization.pathVariable();
        String requestParamName = checkUserAuthorization.requestParam();
        String idFieldName = checkUserAuthorization.idField();

        for (int i = 0; i < args.length; i++) {
            Object arg = args[i];
            if (arg != null) {
                // Check if the parameter is annotated with @PathVariable and matches the name
                if (!pathVariableName.isEmpty() && isAnnotationPresent(parameterAnnotations[i], PathVariable.class, pathVariableName)) {
                    return (String) arg;
                }

                // Check if the parameter is annotated with @RequestParam and matches the name
                if (!requestParamName.isEmpty() && isAnnotationPresent(parameterAnnotations[i], RequestParam.class, requestParamName)) {
                    return (String) arg;
                }

                // Check if the argument is an object with the specified field (default "id")
                Field field;
                try {
                    field = arg.getClass().getDeclaredField(idFieldName);
                    field.setAccessible(true);
                    return (String) field.get(arg);
                } catch (NoSuchFieldException ignored) {
                    // Ignore and try next argument
                }
            }
        }
        throw new UserUnauthorizedException("User ID not found in method arguments.");
    }

    private boolean isAnnotationPresent(Annotation[] annotations, Class<? extends Annotation> annotationClass, String name) {
        for (Annotation annotation : annotations) {
            if (annotationClass.isInstance(annotation)) {
                if (annotationClass == PathVariable.class) {
                    return name.equals(((PathVariable) annotation).value());
                } else if (annotationClass == RequestParam.class) {
                    return name.equals(((RequestParam) annotation).value());
                }
            }
        }
        return false;
    }
}
