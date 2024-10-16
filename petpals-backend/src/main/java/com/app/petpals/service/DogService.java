package com.app.petpals.service;

import com.app.petpals.entity.Dog;
import com.app.petpals.entity.DogTag;
import com.app.petpals.entity.User;
import com.app.petpals.payload.DogAddRequest;
import com.app.petpals.payload.DogEditRequest;
import com.app.petpals.repository.DogRepository;
import com.app.petpals.repository.DogTagRepository;
import com.app.petpals.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
        } else throw new RuntimeException("Dog not found");
    }

    public List<Dog> getDogsByUser(User user) {
        return dogRepository.findAllByUser(user);
    }

    @Transactional
    public Dog saveDog(String userId, DogAddRequest request) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Dog dog = new Dog();
            dog.setUser(user);
            dog.setName(request.getName());
            dog.setDescription(request.getDescription());
            dog.setImageId(request.getImageId());

            List<Dog> userDogs = user.getDogs();
            userDogs.add(dog);
            user.setDogs(userDogs);

            return dogRepository.save(dog);
        } else throw new RuntimeException("User not found");
    }

    @Transactional
    public Dog updateDog(DogEditRequest request) {
        Optional<Dog> optionalDog = dogRepository.findById(request.getId());
        if (optionalDog.isPresent()) {
            Dog dog = optionalDog.get();
            if (request.getName() != null) {
                dog.setName(request.getName());
            }
            if (request.getDescription() != null) {
                dog.setDescription(request.getDescription());
            }
            if (request.getImageId() != null) {
                dog.setImageId(request.getImageId());
            }
            return dogRepository.save(dog);
        } else throw new RuntimeException("Dog not found");
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
        } else throw new RuntimeException("Dog Tag not found.");
    }

    @Transactional
    public Dog removeTagToDog(String dogId, String tagId) {
        Dog dog = getDogById(dogId);
        Optional<DogTag> optionalDogTag = dogTagRepository.findById(tagId);
        if (optionalDogTag.isPresent()) {
            dog.getTags().remove(optionalDogTag.get());
            return dogRepository.save(dog);
        } else throw new RuntimeException("Dog Tag not found.");
    }
}
