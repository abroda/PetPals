package com.app.petpals.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "group_walk")
public class GroupWalk {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "location_name")
    private String locationName;

    @Column(name = "latitude")
    private double latitude;

    @Column(name = "longitude")
    private double longitude;

    @Column(name = "datetime")
    private LocalDateTime datetime;

    @JsonManagedReference
    @ManyToOne()
    @JoinColumn(name = "creator_id")
    private User creator;

    @ManyToMany(mappedBy = "joinedWalks")
    private List<Dog> participants;

    @ElementCollection
    private List<String> tags;

    @JsonManagedReference
    @OneToMany(mappedBy = "groupWalk", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupWalkComment> comments;
}

