package com.app.petpals.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "group_walk_comment")
public class GroupWalkComment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "content")
    private String content;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "commenter_id")
    private User commenter;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "group_walk_id")
    private GroupWalk groupWalk;


    @JsonIgnore
    @ManyToMany(mappedBy = "likedGroupWalkComments")
    private List<User> likes;

    @PreRemove
    private void removeLikesFromUsers() {
        for (User user : likes) {
            user.getLikedGroupWalkComments().remove(this);
        }
        likes.clear();
    }
}
