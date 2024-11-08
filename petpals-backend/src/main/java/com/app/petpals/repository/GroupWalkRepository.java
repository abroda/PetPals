package com.app.petpals.repository;

import com.app.petpals.entity.GroupWalk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupWalkRepository extends JpaRepository<GroupWalk, String> {
}
