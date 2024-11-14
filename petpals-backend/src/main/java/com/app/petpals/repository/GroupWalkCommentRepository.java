package com.app.petpals.repository;

import com.app.petpals.entity.GroupWalkComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupWalkCommentRepository extends JpaRepository<GroupWalkComment, String> {
    List<GroupWalkComment> findByGroupWalkId(String groupWalkId);
}
