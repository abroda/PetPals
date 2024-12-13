package com.app.petpals.repository;

import com.app.petpals.entity.GroupWalk;
import com.app.petpals.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupWalkRepository extends JpaRepository<GroupWalk, String> {
    List<GroupWalk> findAllByCreator(User user);

    @Query(value = """
            SELECT gw.* FROM group_walk gw WHERE gw.datetime >= now() - interval '1 hour'
            """, nativeQuery = true)
    Page<GroupWalk> findAll(Pageable pageable);

    @Query(value = """
            SELECT t.tags
            FROM group_walk_tags t
            WHERE LOWER(t.tags) LIKE LOWER(CONCAT('%', :tag, '%'))
            GROUP BY t.tags
            ORDER BY COUNT(t.tags) DESC
            LIMIT 5
            """, nativeQuery = true)
    List<String> findSuggestedTags(@Param("tag") String tag);

    @Query(value = """
            SELECT gw.* FROM group_walk gw
            JOIN group_walk_tags gwt ON gw.id = gwt.group_walk_id
            WHERE gwt.tags IN (:tags) AND gw.datetime >= now() - interval '1 hour'
            GROUP BY gw.id
            HAVING COUNT(DISTINCT gwt.tags) = :tagCount
            """, nativeQuery = true)
    Page<GroupWalk> findByTags(@Param("tags") List<String> tags, @Param("tagCount") long tagCount, Pageable pageable);

}
