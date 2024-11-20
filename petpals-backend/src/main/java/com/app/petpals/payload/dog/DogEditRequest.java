package com.app.petpals.payload.dog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DogEditRequest {
    private String name;
    private String description;
    private String breed;
    private Integer age;
    private BigDecimal weight;
    private Set<String> tagIds;
}
