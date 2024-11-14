package com.app.petpals.repository;

import com.app.petpals.entity.Dog;
import com.app.petpals.entity.GroupWalk;
import com.app.petpals.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupWalkRepository extends JpaRepository<GroupWalk, String> {
    List<GroupWalk> findAllByCreator(User user);
}
