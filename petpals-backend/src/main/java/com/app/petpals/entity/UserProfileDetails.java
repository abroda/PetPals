package com.app.petpals.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "user_details")
public class UserProfileDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "description")
    private String description;

    @Column(name = "profile_picture_id", unique = true)
    private String profilePictureId;

    @JsonBackReference
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    public UserProfileDetails(String description, User user) {
        this.description = description;
        this.user = user;
    }

    public UserProfileDetails() {}
}
