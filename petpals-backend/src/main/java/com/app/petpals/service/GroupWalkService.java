package com.app.petpals.service;

import com.app.petpals.entity.Dog;
import com.app.petpals.entity.GroupWalk;
import com.app.petpals.entity.User;
import com.app.petpals.exception.GroupWalkDataException;
import com.app.petpals.exception.GroupWalkNotFoundException;
import com.app.petpals.payload.GroupWalkAddRequest;
import com.app.petpals.payload.GroupWalkEditRequest;
import com.app.petpals.payload.GroupWalkJoinRequest;
import com.app.petpals.repository.GroupWalkRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
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

    public GroupWalk getGroupWalkById(String walkId) {
        return groupWalkRepository.findById(walkId).orElseThrow(() -> new GroupWalkNotFoundException("GroupWalk not found"));
    }

    @Transactional
    public GroupWalk saveGroupWalk(GroupWalkAddRequest request) {
        User creator = userService.getById(request.getCreatorId());
        if (request.getTitle() == null) throw new GroupWalkDataException("Title is required.");
        if (request.getLocation() == null) throw new GroupWalkDataException("Location is required");
        if (request.getDatetime() == null) throw new GroupWalkDataException("Datetime is required");

        GroupWalk groupWalk = new GroupWalk();
        groupWalk.setTitle(request.getTitle());
        groupWalk.setDescription(request.getDescription());
        groupWalk.setDatetime(checkDatetime(request.getDatetime()));
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

    public GroupWalk editGroupWalk(String walkId, GroupWalkEditRequest request) {
        GroupWalk groupWalk = getGroupWalkById(walkId);
        if (request.getTitle() == null) throw new GroupWalkDataException("Title is required.");
        if (request.getLocation() == null) throw new GroupWalkDataException("Location is required");
        if (request.getDatetime() == null) throw new GroupWalkDataException("Datetime is required");

        groupWalk.setTitle(request.getTitle());
        groupWalk.setDescription(request.getDescription());
        groupWalk.setDatetime(checkDatetime(request.getDatetime()));
        groupWalk.setLocation(request.getLocation());
        groupWalk.setTags(request.getTags());

        return groupWalkRepository.save(groupWalk);
    }

    @Transactional
    public void deleteGroupWalk(String walkId) {
        GroupWalk groupWalk = getGroupWalkById(walkId);
        groupWalk.getCreator().getCreatedWalks().remove(groupWalk);
        groupWalk.getParticipants().forEach((dog) -> dog.getJoinedWalks().remove(groupWalk));
        groupWalkRepository.delete(groupWalk);
    }

    @Transactional
    public GroupWalk joinWalk(String walkId, GroupWalkJoinRequest request) {
        GroupWalk groupWalk = getGroupWalkById(walkId);
        String ownerId = null;
        for (String dogId : request.getDogIds()) {
            Dog dog = dogService.getDogById(dogId);
            String currentOwnerId = dog.getUser().getId();
            if (ownerId == null) {
                ownerId = currentOwnerId;
            } else if (!ownerId.equals(currentOwnerId)) {
                throw new GroupWalkDataException("All dogs must belong to the same owner");
            }

            if (groupWalk.getParticipants().contains(dog)) throw new GroupWalkDataException("Dog already is a participant.");

            dog.getJoinedWalks().add(groupWalk);
            groupWalk.getParticipants().add(dog);
        }

        return groupWalkRepository.save(groupWalk);
    }

    public LocalDateTime checkDatetime(String datetime) {
        try {
            return LocalDateTime.parse(datetime);
        } catch (DateTimeParseException e) {
            throw new GroupWalkDataException("Datetime has to be in correct format. For example 2023-11-08T14:30:00");
        }
    }
}
