package com.app.petpals.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "dog_tag")
public class DogTag {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "tag")
    private String tag;

    @JsonBackReference
    @ManyToMany(mappedBy = "tags")
    Set<Dog> dogs;
}
