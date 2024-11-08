package com.app.petpals.service;

import com.app.petpals.entity.Dog;
import com.app.petpals.entity.DogTag;
import com.app.petpals.entity.User;
import com.app.petpals.exception.DogDataException;
import com.app.petpals.exception.DogNotFoundException;
import com.app.petpals.exception.DogTagNotFoundException;
import com.app.petpals.exception.UserNotFoundException;
import com.app.petpals.payload.DogAddRequest;
import com.app.petpals.payload.DogEditRequest;
import com.app.petpals.repository.DogRepository;
import com.app.petpals.repository.DogTagRepository;
import com.app.petpals.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DogService {
    private final DogRepository dogRepository;
    private final UserRepository userRepository;
    private final DogTagRepository dogTagRepository;

    public List<Dog> getDogs() {
        return dogRepository.findAll();
    }

    public Dog getDogById(String id) {
        Optional<Dog> dog = dogRepository.findById(id);
        if (dog.isPresent()) {
            return dog.get();
        } else throw new DogNotFoundException("Dog not found.");
    }

    public List<Dog> getAllDogsById(List<String> ids) {
      return dogRepository.findAllById(ids);
    }

    public List<Dog> getDogsByUser(User user) {
        return dogRepository.findAllByUser(user);
    }

    public List<Dog> getDogsByTagId(String tagId) {
        Optional<DogTag> dogTagOptional = dogTagRepository.findById(tagId);
        if (dogTagOptional.isPresent()) {
            DogTag dogTag = dogTagOptional.get();
            return new ArrayList<>(dogTag.getDogs());
        } else throw new DogTagNotFoundException("Dog tag not found.");
    }

    @Transactional
    public Dog saveDog(String userId, DogAddRequest request) {
        if (request.getName() == null) throw new DogDataException("Dog name is required.");
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Dog dog = new Dog();
            dog.setUser(user);
            dog.setName(request.getName());
            dog.setDescription(request.getDescription());
            dog.setTags(dogTagRepository.findAllByIdIn(request.getTagIds()));

            List<Dog> userDogs = user.getDogs();
            userDogs.add(dog);
            user.setDogs(userDogs);

            return dogRepository.save(dog);
        } else throw new UserNotFoundException("User not found.");
    }

    public Dog updateDog(String id, DogEditRequest request) {
        if (request.getName() == null) throw new DogDataException("Dog name is required.");
        Optional<Dog> optionalDog = dogRepository.findById(id);
        if (optionalDog.isPresent()) {
            Dog dog = optionalDog.get();
            dog.setName(request.getName());
            dog.setDescription(request.getDescription());
            if (request.getTagIds() != null) {
                dog.setTags(dogTagRepository.findAllByIdIn(request.getTagIds()));
            }
            return dogRepository.save(dog);
        } else throw new DogNotFoundException("Dog not found.");
    }

    public Dog updateDogPicture(String id, String imageId) {
        Dog dog = getDogById(id);
        dog.setImageId(imageId);
        return dogRepository.save(dog);
    }

    public Dog deleteDogPicture(String id) {
        Dog dog = getDogById(id);
        dog.setImageId(null);
        return dogRepository.save(dog);
    }

    @Transactional
    public void deleteDog(String dogId) {
        dogRepository.deleteById(dogId);
    }

    @Transactional
    public Dog addTagToDog(String dogId, String tagId) {
        Dog dog = getDogById(dogId);
        Optional<DogTag> optionalDogTag = dogTagRepository.findById(tagId);
        if (optionalDogTag.isPresent()) {
            dog.getTags().add(optionalDogTag.get());
            return dogRepository.save(dog);
        } else throw new DogTagNotFoundException("Dog Tag not found.");
    }

    @Transactional
    public Dog removeTagToDog(String dogId, String tagId) {
        Dog dog = getDogById(dogId);
        Optional<DogTag> optionalDogTag = dogTagRepository.findById(tagId);
        if (optionalDogTag.isPresent()) {
            dog.getTags().remove(optionalDogTag.get());
            return dogRepository.save(dog);
        } else throw new DogTagNotFoundException("Dog Tag not found.");
    }
}
