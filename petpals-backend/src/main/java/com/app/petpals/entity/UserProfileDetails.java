package com.app.petpals.entity;

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

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    public UserProfileDetails(String description, String profilePictureUrl, User user) {
        this.description = description;
        this.profilePictureUrl = profilePictureUrl;
        this.user = user;
    }

    public UserProfileDetails() {}
}
