package com.app.petpals.payload;

import com.app.petpals.entity.UserProfileDetails;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String username;
    private String email;
    private UserProfileDetails userProfileDetails;
}
