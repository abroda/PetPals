package com.app.petpals.entity;

import com.app.petpals.enums.FriendshipRequestStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "friendship_request", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"sender_id", "receiver_id"})
})
public class Friendship {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @Enumerated(EnumType.STRING)
    private FriendshipRequestStatus status;
}
