//package com.app.petpals.entity;
//
//import jakarta.persistence.*;
//import lombok.Data;
//
//@Data
//@Entity
//@Table(name = "like")
//public class Like {
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    private String id;
//
//    private Long entityId;
//
//    @Enumerated(EnumType.STRING)
//    private EntityType entityType; // Assume EntityType is an enum with POST, COMMENT, etc.
//
//    private LocalDateTime createdAt;
//}
