package com.app.petpals.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "walk")
public class Walk {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
}
