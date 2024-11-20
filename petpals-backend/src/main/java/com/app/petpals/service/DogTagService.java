package com.app.petpals.service;

import com.app.petpals.entity.DogTag;
import com.app.petpals.exception.dog.DogTagNotFoundException;
import com.app.petpals.payload.dogTag.DogTagCategoryResponse;
import com.app.petpals.payload.dogTag.DogTagDetails;
import com.app.petpals.payload.dogTag.DogTagRequest;
import com.app.petpals.repository.DogTagRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DogTagService {

    private final DogTagRepository dogTagRepository;

    public List<DogTagCategoryResponse> findAllGroupedByCategory() {
        List<DogTag> tags = dogTagRepository.findAll();
        Map<String, List<DogTag>> groupedByCategory = tags.stream()
                .collect(Collectors.groupingBy(DogTag::getCategory));

        return groupedByCategory.entrySet().stream()
                .map(entry -> {
                    String category = entry.getKey();
                    List<DogTagDetails> tagDetails = entry.getValue().stream()
                            .map(tag -> new DogTagDetails(tag.getId(), tag.getTag()))
                            .toList();

                    DogTagCategoryResponse dto = new DogTagCategoryResponse();
                    dto.setCategory(category);
                    dto.setTags(tagDetails);
                    return dto;
                })
                .collect(Collectors.toList());
    }


    public DogTag findById(String tagId) {
        Optional<DogTag> dogTagOptional = dogTagRepository.findById(tagId);
        if (dogTagOptional.isPresent()) {
            return dogTagOptional.get();
        } else throw new DogTagNotFoundException("Tag not found.");
    }
}
