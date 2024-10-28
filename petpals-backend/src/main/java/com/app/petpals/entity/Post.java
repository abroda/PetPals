package com.app.petpals.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "post")
public class Post extends CommentableEntity {

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "post_picture_id", unique = true)
    private String postPictureId;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;
}
