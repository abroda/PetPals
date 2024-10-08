package com.app.petpals.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "images")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

//    @Lob
    @Column(name = "image", nullable = false)
    private byte[] image;
}
