package com.app.petpals.service;

import com.app.petpals.entity.Dog;
import com.app.petpals.entity.GroupWalk;
import com.app.petpals.entity.User;
import com.app.petpals.exception.GroupWalkDataException;
import com.app.petpals.exception.GroupWalkNotFoundException;
import com.app.petpals.payload.*;
import com.app.petpals.repository.GroupWalkRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupWalkService {
    private final GroupWalkRepository groupWalkRepository;
    private final UserService userService;
    private final DogService dogService;
    private final AWSImageService awsImageService;

    public List<GroupWalk> getAllGroupWalks() {
        return groupWalkRepository.findAll();
    }

    public GroupWalk getGroupWalkById(String walkId) {
        return groupWalkRepository.findById(walkId).orElseThrow(() -> new GroupWalkNotFoundException("GroupWalk not found"));
    }

    public List<GroupWalk> getAllCreatedGroupWalks(User creator) {
        return groupWalkRepository.findAllByCreator(creator);
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

        if (request.getTags() != null && !request.getTags().isEmpty()) {
            groupWalk.setTags(request.getTags());
        } else groupWalk.setTags(new ArrayList<>());

        if (request.getParticipatingDogsIds() != null && !request.getParticipatingDogsIds().isEmpty()) {
            List<Dog> dogs = dogService.getAllDogsById(request.getParticipatingDogsIds());
            groupWalk.setParticipants(dogs);
            for (Dog dog : dogs) {
                dog.getJoinedWalks().add(groupWalk);
            }
        } else groupWalk.setParticipants(new ArrayList<>());

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
    public GroupWalk joinWalk(String walkId, String userId, GroupWalkJoinRequest request) {
        GroupWalk groupWalk = getGroupWalkById(walkId);
        for (String dogId : request.getDogIds()) {
            Dog dog = dogService.getDogById(dogId);
            if (!Objects.equals(dog.getUser().getId(), userId))
                throw new GroupWalkDataException("All dogs must belong to the user.");
            if (groupWalk.getParticipants().contains(dog))
                throw new GroupWalkDataException("Dog already is a participant.");
            dog.getJoinedWalks().add(groupWalk);
            groupWalk.getParticipants().add(dog);
        }

        return groupWalkRepository.save(groupWalk);
    }

    @Transactional
    public GroupWalk leaveWalk(String walkId, String userId, GroupWalkLeaveRequest request) {
        GroupWalk groupWalk = getGroupWalkById(walkId);
        for (String dogId : request.getDogIds()) {
            Dog dog = dogService.getDogById(dogId);
            if (!Objects.equals(dog.getUser().getId(), userId))
                throw new GroupWalkDataException("All dogs must belong to the user.");
            if (!groupWalk.getParticipants().contains(dog))
                throw new GroupWalkDataException("Dog is not a participant.");
            dog.getJoinedWalks().remove(groupWalk);
            groupWalk.getParticipants().remove(dog);
        }
        return groupWalkRepository.save(groupWalk);
    }


    public List<String> getSuggestedTags(String tagQuery){
        return groupWalkRepository.findSuggestedTags(tagQuery);
    }


    public LocalDateTime checkDatetime(String datetime) {
        try {
            return LocalDateTime.parse(datetime);
        } catch (DateTimeParseException e) {
            throw new GroupWalkDataException("Datetime has to be in correct format. For example 2023-11-08T14:30:00");
        }
    }

    public GroupWalkResponse createGroupWalkResponse(GroupWalk groupWalk) {
        return GroupWalkResponse.builder()
                .id(groupWalk.getId())
                .title(groupWalk.getTitle())
                .description(groupWalk.getDescription())
                .location(groupWalk.getLocation())
                .datetime(groupWalk.getDatetime().toString())
                .creator(
                        GroupWalkCreatorResponse.builder()
                                .userId(groupWalk.getCreator().getId())
                                .username(groupWalk.getCreator().getDisplayName())
                                .imageUrl(Optional.ofNullable(groupWalk.getCreator().getProfilePictureId())
                                        .map(awsImageService::getPresignedUrl)
                                        .orElse(null))
                                .build()
                )
                .tags(groupWalk.getTags())
                .participants(getGroupWalkParticipants(groupWalk))
                .build();
    }

    public List<GroupWalkParticipantResponse> getGroupWalkParticipants(GroupWalk groupWalk) {
        return groupWalk.getParticipants().stream()
                .collect(Collectors.groupingBy(Dog::getUser))
                .entrySet().stream()
                .map(entry -> {
                    User owner = entry.getKey();
                    List<GroupWalkParticipantDogResponse> dogs = entry.getValue().stream()
                            .map(dog -> GroupWalkParticipantDogResponse.builder()
                                    .dogId(dog.getId())
                                    .name(dog.getName())
                                    .imageUrl(Optional.ofNullable(dog.getImageId())
                                            .map(awsImageService::getPresignedUrl)
                                            .orElse(null))
                                    .build())
                            .collect(Collectors.toList());

                    return GroupWalkParticipantResponse.builder()
                            .userId(owner.getId())
                            .username(owner.getUsername())
                            .imageUrl((Optional.ofNullable(owner.getProfilePictureId())
                                    .map(awsImageService::getPresignedUrl)
                                    .orElse(null)))
                            .dogs(dogs)
                            .build();
                })
                .collect(Collectors.toList());
    }
}
