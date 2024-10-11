package com.app.petpals.service;

import com.app.petpals.entity.Dog;
import com.app.petpals.entity.User;
import com.app.petpals.repository.DogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DogService {
    private final DogRepository dogRepository;
    private final UserService userService;

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

    public Dog saveDog(String userId) {
        User user = userService.getById(userId);
        Dog dog = new Dog();

        List<Dog> userDogs = user.getDogs();
        return dogRepository.save(dog);
    }
}
