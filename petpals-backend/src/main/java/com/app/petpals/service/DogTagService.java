package com.app.petpals.service;

import com.app.petpals.entity.DogTag;
import com.app.petpals.exception.DogTagNotFoundException;
import com.app.petpals.repository.DogTagRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DogTagService {

    private final DogTagRepository dogTagRepository;

    public List<DogTag> findAll() {
        return dogTagRepository.findAll();
    }

    public DogTag findById(String tagId) {
        Optional<DogTag> dogTagOptional = dogTagRepository.findById(tagId);
        if (dogTagOptional.isPresent()) {
            return dogTagOptional.get();
        } else throw new DogTagNotFoundException("Tag not found.");
    }

    @Transactional
    public DogTag save(String tagName) {
        DogTag dogTag = new DogTag();
        dogTag.setTag(tagName);
        return dogTagRepository.save(dogTag);
    }

    @Transactional
    public DogTag updateDogTag(String tagId, String tagName) {
        Optional<DogTag> dogTagOptional = dogTagRepository.findById(tagId);
        if (dogTagOptional.isPresent()) {
            DogTag dogTag = dogTagOptional.get();
            dogTag.setTag(tagName);
            return dogTagRepository.save(dogTag);
        } else throw new DogTagNotFoundException("Tag not found.");
    }

    @Transactional
    public void deleteDogTag(String tagId) {
        dogTagRepository.deleteById(tagId);
    }
}
