package com.app.petpals.repository;

import com.app.petpals.entity.Dog;
import com.app.petpals.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DogRepository extends JpaRepository<Dog, String> {
    List<Dog> findAllByUser(User user);
}
