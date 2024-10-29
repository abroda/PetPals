package com.app.petpals.service;

import com.app.petpals.entity.Post;
import com.app.petpals.entity.User;
import com.app.petpals.exception.PostDataException;
import com.app.petpals.exception.PostNotFoundException;
import com.app.petpals.payload.LikePostRequest;
import com.app.petpals.payload.PostAddRequest;
import com.app.petpals.payload.PostEditRequest;
import com.app.petpals.repository.PostRepository;
import com.app.petpals.repository.UserRepository;
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
    private final UserRepository userRepository;

    public List<Post> getTest() {
        return postRepository.findAll();
    }

    public Page<Post> getPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    public Post getPostById(String postId) {
        return postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException("Post not found."));
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

    public Post updatePost(String postId, PostEditRequest request) {
        if (request.getTitle() == null) throw new PostDataException("Post title is required.");
        Post post = getPostById(postId);
        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        return postRepository.save(post);
    }

    public Post updatePostPicture(String postId, String imageId) {
        Post post = getPostById(postId);
        post.setPostPictureId(imageId);
        return postRepository.save(post);
    }

    @Transactional
    public Post likePost(String postId, LikePostRequest request) {
        User user = userService.getById(request.getUserId());
        Post post = getPostById(postId);
        if (!user.getLikedPosts().contains(post) && !post.getLikes().contains(user)) {
            user.getLikedPosts().add(post);
            post.getLikes().add(user);
            userRepository.save(user);
            return postRepository.save(post);
        } else throw new PostNotFoundException("temp");
    }

    public Post deletePostPicture(String postId) {
        Post post = getPostById(postId);
        post.setPostPictureId(null);
        return postRepository.save(post);
    }

    @Transactional
    public void deletePost(String postId) {
        postRepository.deleteById(postId);
    }
}
