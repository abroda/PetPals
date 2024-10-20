package com.app.petpals.payload;

import com.app.petpals.entity.Dog;
import com.app.petpals.enums.UserVisibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountResponse {
    private String id;
    private String email;
    private String username;
    private String description;
    private String imageUrl;
    private UserVisibility visibility;
}
