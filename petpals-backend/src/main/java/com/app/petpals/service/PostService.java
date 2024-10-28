package com.app.petpals.service;

import com.app.petpals.entity.Post;
import com.app.petpals.entity.User;
import com.app.petpals.exception.PostDataException;
import com.app.petpals.exception.PostNotFoundException;
import com.app.petpals.payload.PostAddRequest;
import com.app.petpals.repository.PostRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final UserService userService;

    public List<Post> getTest(){
        return postRepository.findAll();
    }

    public Page<Post> getPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    public Post getPostById(String id) {
        return postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post not found."));
    }

    @Transactional
    public Post addPost(PostAddRequest request) {
        if (request.getTitle() == null) throw new PostDataException("Post title is required.");
        if (request.getUserId() == null) throw new PostDataException("Creator id is required.");
        User creator = userService.getById(request.getUserId());
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        post.setCreator(creator);
        return postRepository.save(post);
    }

    public Post updatePostPicture(String id, String imageId) {
        Post post = getPostById(id);
        post.setPostPictureId(imageId);
        return postRepository.save(post);
    }

//    public List<Post> getPosts(){
//        return postRepository.findAll();
//    }
}
