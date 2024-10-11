package com.app.petpals.service;

import com.app.petpals.entity.Dog;
import com.app.petpals.entity.User;
import com.app.petpals.payload.DogAddRequest;
import com.app.petpals.repository.DogRepository;
import com.app.petpals.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DogService {
    private final DogRepository dogRepository;
    private final UserService userService;
    private final UserRepository userRepository;

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

    public Dog saveDog(String userId, DogAddRequest request) {
        User user = userService.getById(userId);

        Dog dog = new Dog();
        dog.setUser(user);
        dog.setName(request.getName());
        dog.setDescription(request.getDescription());
        dog.setImageId(request.getImageId());

        List<Dog> userDogs = user.getDogs();
        userDogs.add(dog);
        user.setDogs(userDogs);

        return dogRepository.save(dog);
    }
}
