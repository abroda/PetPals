package com.app.petpals.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

@RequiredArgsConstructor
public class CustomHandshakeHandler extends DefaultHandshakeHandler {

    private final UserDetailsService userDetailsService;

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        String userEmail = (String) attributes.get("user");
        UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
        if (userEmail != null) {
            // Create a Principal object based on the email
            return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        }
        return null;
    }
}
