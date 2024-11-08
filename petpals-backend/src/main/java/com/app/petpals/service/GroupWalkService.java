package com.app.petpals.service;

import com.app.petpals.entity.Dog;
import com.app.petpals.entity.GroupWalk;
import com.app.petpals.entity.User;
import com.app.petpals.exception.GroupWalkDataException;
import com.app.petpals.exception.GroupWalkNotFoundException;
import com.app.petpals.payload.GroupWalkAddRequest;
import com.app.petpals.payload.GroupWalkEditRequest;
import com.app.petpals.repository.GroupWalkRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupWalkService {
    private final GroupWalkRepository groupWalkRepository;
    private final UserService userService;
    private final DogService dogService;

    public List<GroupWalk> getAllGroupWalks() {
        return groupWalkRepository.findAll();
    }

    public GroupWalk getGroupWalkById(String id) {
        return groupWalkRepository.findById(id).orElseThrow(() -> new GroupWalkNotFoundException("GroupWalk not found"));
    }

    @Transactional
    public GroupWalk saveGroupWalk(GroupWalkAddRequest request) {
        System.out.println("SAVING GROUP WALK");
        User creator = userService.getById(request.getCreatorId());
        if (request.getTitle() == null) throw new GroupWalkDataException("Title is required.");
        if (request.getLocation() == null) throw new GroupWalkDataException("Location is required");
        if (request.getDatetime() == null) throw new GroupWalkDataException("Datetime is required");
        System.out.println("PASSED CHECKS");

        GroupWalk groupWalk = new GroupWalk();
        groupWalk.setTitle(request.getTitle());
        groupWalk.setDescription(request.getDescription());
        System.out.println("DATETIME 1");
        groupWalk.setDatetime(LocalDateTime.parse(request.getDatetime()));
        System.out.println("DATETIME 2");
        groupWalk.setLocation(request.getLocation());
        groupWalk.setCreator(creator);
        groupWalk.setTags(request.getTags());

        List<Dog> dogs = dogService.getAllDogsById(request.getParticipatingDogsIds());
        groupWalk.setParticipants(dogs);
        for (Dog dog : dogs) {
            dog.getJoinedWalks().add(groupWalk);
        }
        return groupWalkRepository.save(groupWalk);
    }

    public GroupWalk editGroupWalk(String id, GroupWalkEditRequest request) {
        GroupWalk groupWalk = getGroupWalkById(id);
        if (request.getTitle() == null) throw new GroupWalkDataException("Title is required.");
        if (request.getLocation() == null) throw new GroupWalkDataException("Location is required");
        if (request.getDatetime() == null) throw new GroupWalkDataException("Datetime is required");

        groupWalk.setTitle(request.getTitle());
        groupWalk.setDescription(request.getDescription());
        groupWalk.setDatetime(LocalDateTime.parse(request.getDatetime()));
        groupWalk.setLocation(request.getLocation());
        groupWalk.setTags(request.getTags());

        return groupWalkRepository.save(groupWalk);
    }

    @Transactional
    public void deleteGroupWalk(String id) {
        GroupWalk groupWalk = getGroupWalkById(id);
        groupWalkRepository.delete(groupWalk);
    }
}
