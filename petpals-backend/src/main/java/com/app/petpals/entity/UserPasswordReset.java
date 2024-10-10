package com.app.petpals.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "user_password_reset")
public class UserPasswordReset {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "reset_code", unique = true)
    private String resetCode;

    @Column(name = "reset_expiration")
    private LocalDateTime resetExpiration;

    @JsonBackReference
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    public UserPasswordReset(String resetCode, LocalDateTime resetExpiration, User user) {
        this.resetCode = resetCode;
        this.resetExpiration = resetExpiration;
        this.user = user;
    }

    public UserPasswordReset() {}
}
