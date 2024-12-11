package com.app.petpals.config;

import com.app.petpals.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.converter.DefaultContentTypeResolver;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.converter.MessageConverter;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final Map<String, String> sessionRegistry = new ConcurrentHashMap<>();

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/user");
        registry.setApplicationDestinationPrefixes("/app");

    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:*")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        System.out.println("Registered interceptors");
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                System.out.println("HERE!");
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    System.out.println("Authorization Header: " + authHeader);
                    String token = authHeader.replace("Bearer ", "");
                    final String userEmail = jwtService.extractUsername(token);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                    if (authHeader == null || !jwtService.isTokenValid(token, userDetails)) {
                        throw new IllegalArgumentException("Invalid Authorization Token");
                    }

                    String sessionId = accessor.getSessionId();
                    if (sessionRegistry.containsValue(userEmail)) {
                        // Disconnect the existing session
                        System.out.println(">>>> SESSION ALREADY EXISTS: " + sessionId + "    " + userEmail);
                        String existingSessionId = getKeyByValue(sessionRegistry, userEmail);
                        if (existingSessionId != null) {
                            System.out.println(">>>> REMOVING SESSION: " + existingSessionId);
                            sessionRegistry.remove(existingSessionId);
                        }
                    }
                    System.out.println(">>>> PUTTING NEW SESSION: " + sessionId + "    " + userEmail);
                    sessionRegistry.put(sessionId, userEmail);
                }

                if (accessor != null && StompCommand.DISCONNECT.equals(accessor.getCommand())) {
                    String sessionId = accessor.getSessionId();
                    System.out.println(">>>> DISCONNECT: " + sessionId);
                    sessionRegistry.remove(sessionId);
                }

                if (accessor != null && StompCommand.MESSAGE.equals(accessor.getCommand())) {
                    System.out.println("Session Registry Contents: ");
                    sessionRegistry.forEach((sessionId, userEmail) ->
                            System.out.println("Session ID: " + sessionId + ", User Email: " + userEmail)
                    );
                }

                return message;
            }
        });
    }

    private String getKeyByValue(Map<String, String> map, String value) {
        for (Map.Entry<String, String> entry : map.entrySet()) {
            if (value.equals(entry.getValue())) {
                return entry.getKey();
            }
        }
        return null;
    }
}
