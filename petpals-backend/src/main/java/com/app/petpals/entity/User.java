package com.app.petpals.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "_user", uniqueConstraints = {@UniqueConstraint(name = "emailUnique", columnNames = {"email"})})
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "username", unique = true, nullable = false)
    private String displayName;

    @Column(name = "email", unique = true, nullable = false)
    private String username; // email named username for UserDetails casting

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "enabled")
    private boolean enabled;

    @Column(name = "verification_code")
    private String verificationCode;

    @Column(name = "verification_expiration")
    private LocalDateTime verificationExpiration;

    @JsonManagedReference
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserPasswordReset passwordReset;

    @JsonManagedReference
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserProfileDetails userProfileDetails;

    @JsonManagedReference
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Dog> dogs;

    public User(String username, String displayName, String password) {
        this.username = username;
        this.displayName = displayName;
        this.password = password;
    }

    public User() {
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
