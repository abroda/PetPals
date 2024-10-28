package com.app.petpals.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "walk")
public class Walk extends CommentableEntity {
}
