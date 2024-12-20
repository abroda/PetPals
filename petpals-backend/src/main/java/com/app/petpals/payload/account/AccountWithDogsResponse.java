package com.app.petpals.payload.account;

import com.app.petpals.entity.Dog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountWithDogsResponse {
    private String email;
    private String username;
    private String description;
    private String imageUrl;
    private List<Dog> dogs;
}
