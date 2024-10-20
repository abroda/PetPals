package com.app.petpals.payload;

import com.app.petpals.enums.UserVisibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountEditRequest {
    private String displayName;
    private String description;
    private UserVisibility visibility;
}
