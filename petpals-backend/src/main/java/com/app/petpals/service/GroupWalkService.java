package com.app.petpals.service;

import com.app.petpals.entity.Dog;
import com.app.petpals.entity.GroupWalk;
import com.app.petpals.entity.User;
import com.app.petpals.exception.groupWalk.GroupWalkDataException;
import com.app.petpals.exception.groupWalk.GroupWalkNotFoundException;
import com.app.petpals.payload.groupWalk.*;
import com.app.petpals.repository.GroupWalkRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
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
    private final FriendshipService friendshipService;
    private final AWSImageService awsImageService;

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
        if (request.getLocationName() == null) throw new GroupWalkDataException("Location name is required");
        if (request.getDatetime() == null) throw new GroupWalkDataException("Datetime is required");
        if (request.getParticipatingDogsIds() == null || request.getParticipatingDogsIds().isEmpty()) throw new GroupWalkDataException("Must participate with at least one dog.");

        GroupWalk groupWalk = new GroupWalk();
        groupWalk.setTitle(request.getTitle());
        groupWalk.setDescription(request.getDescription());
        groupWalk.setDatetime(checkDatetime(request.getDatetime()));
        groupWalk.setLocationName(request.getLocationName());
        groupWalk.setLatitude(request.getLatitude());
        groupWalk.setLongitude(request.getLongitude());
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
        if (request.getLocationName() == null) throw new GroupWalkDataException("Location name is required");
        if (request.getDatetime() == null) throw new GroupWalkDataException("Datetime is required");
        if (request.getParticipatingDogsIds() == null || request.getParticipatingDogsIds().isEmpty()) throw new GroupWalkDataException("Must participate with at least one dog.");

        groupWalk.setTitle(request.getTitle());
        groupWalk.setDescription(request.getDescription());
        groupWalk.setDatetime(checkDatetime(request.getDatetime()));
        groupWalk.setLocationName(request.getLocationName());
        groupWalk.setLatitude(request.getLatitude());
        groupWalk.setLongitude(request.getLongitude());
        groupWalk.setTags(request.getTags());

        // Update participants
        if (request.getParticipatingDogsIds() != null) {
            // Fetch the creator's dogs
            List<Dog> userDogs = dogService.getDogsByUserId(groupWalk.getCreator().getId());

            // Remove all creator's dog as participants
            userDogs.forEach(dog -> {
                groupWalk.getParticipants().remove(dog);
                dog.getJoinedWalks().remove(groupWalk);
            });

            // Filter the request's dog IDs to ensure they belong to the user
            List<Dog> validDogs = userDogs.stream()
                    .filter(dog -> request.getParticipatingDogsIds().contains(dog.getId()))
                    .toList();

            // Add the dogs confirmed to be valid as participants
            validDogs.forEach(dog -> {
                groupWalk.getParticipants().add(dog);
                dog.getJoinedWalks().add(groupWalk);
            });
        }

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

        if (request.getDogIds() != null) {
            // Fetch the user's dogs
            List<Dog> userDogs = dogService.getDogsByUserId(userId);

            // Remove all user's dog as participants
            userDogs.forEach(dog -> {
                groupWalk.getParticipants().remove(dog);
                dog.getJoinedWalks().remove(groupWalk);
            });

            // Filter the request's dog IDs to ensure they belong to the user
            List<Dog> validDogs = userDogs.stream()
                    .filter(dog -> request.getDogIds().contains(dog.getId()))
                    .toList();

            // Add the dogs confirmed to be valid as participants
            validDogs.forEach(dog -> {
                groupWalk.getParticipants().add(dog);
                dog.getJoinedWalks().add(groupWalk);
            });
        }

        return groupWalkRepository.save(groupWalk);
    }

    @Transactional
    public GroupWalk leaveWalk(String walkId, String userId) {//, GroupWalkLeaveRequest request) {
        GroupWalk groupWalk = getGroupWalkById(walkId);
        // Fetch the user's dogs
        List<Dog> userDogs = dogService.getDogsByUserId(userId);

        // Remove all creator's dog as participants
        userDogs.forEach(dog -> {
            groupWalk.getParticipants().remove(dog);
            dog.getJoinedWalks().remove(groupWalk);
        });

        return groupWalkRepository.save(groupWalk);
    }


    public List<String> getSuggestedTags(String tagQuery) {
        return groupWalkRepository.findSuggestedTags(tagQuery);
    }

    public Page<GroupWalk> getGroupWalksByTags(List<String> tags, Pageable pageable) {
        if (tags == null || tags.isEmpty()) {
            return groupWalkRepository.findAll(pageable);
        } else {
            return groupWalkRepository.findByTags(tags, tags.size(), pageable);
        }
    }




    public ZonedDateTime checkDatetime(String datetime) {
        try {
            return ZonedDateTime.parse(datetime);
        } catch (DateTimeParseException e) {
            throw new GroupWalkDataException("Datetime has to be in correct format. For example 2023-11-08T14:30:00");
        }
    }

    public GroupWalkResponse createGroupWalkResponse(GroupWalk groupWalk) {
        return GroupWalkResponse.builder()
                .id(groupWalk.getId())
                .title(groupWalk.getTitle())
                .description(groupWalk.getDescription())
                .locationName(groupWalk.getLocationName())
                .latitude(groupWalk.getLatitude())
                .longitude(groupWalk.getLongitude())
                .datetime(groupWalk.getDatetime().toString())
                .creator(
                        GroupWalkCreatorResponse.builder()
                                .userId(groupWalk.getCreator().getId())
                                .username(groupWalk.getCreator().getDisplayName())
                                .imageUrl(Optional.ofNullable(groupWalk.getCreator().getProfilePictureId())
                                        .map(awsImageService::getPresignedUrl)
                                        .orElse(null))
                                .dogsCount(dogService.getDogsByUserId(groupWalk.getCreator().getId()).size())
                                .friendsCount(friendshipService.getAcceptedFriendshipsForUser(groupWalk.getCreator().getId()).size())
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
                            .username(owner.getDisplayName())
                            .imageUrl((Optional.ofNullable(owner.getProfilePictureId())
                                    .map(awsImageService::getPresignedUrl)
                                    .orElse(null)))
                            .dogs(dogs)
                            .build();
                })
                .collect(Collectors.toList());
    }
}
