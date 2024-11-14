package com.app.petpals.payload.dog;

import com.app.petpals.entity.DogTag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DogResponse {
    private String id;
    private String name;
    private String description;
    private String imageUrl;
    private Set<DogTag> tags;
}
