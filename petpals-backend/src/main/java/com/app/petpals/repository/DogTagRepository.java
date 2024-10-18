package com.app.petpals.repository;

import com.app.petpals.entity.DogTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface DogTagRepository extends JpaRepository<DogTag, String> {
    Set<DogTag> findAllByIdIn(Set<String> ids);
}
