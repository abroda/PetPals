package com.app.petpals.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GroupWalkEditRequest {
    private String title;
    private String description;
    private String datetime;
    private String location;
    private List<String> tags;
}
