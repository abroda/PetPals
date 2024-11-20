package com.app.petpals.payload.dog;

import com.app.petpals.payload.dogTag.DogTagCategoryResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DogResponse {
    private String id;
    private String name;
    private String description;
    private String imageUrl;
    private Integer age;
    private String breed;
    private BigDecimal weight;
    private List<DogTagCategoryResponse> tags;
}
