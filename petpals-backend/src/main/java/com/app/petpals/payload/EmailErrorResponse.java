package com.app.petpals.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class EmailErrorResponse {
    private int status;
    private String message;
    private long timestamp;
}
