package com.app.petpals.payload.account;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserErrorResponse {
    private int status;
    private String message;
    private long timestamp;
}
