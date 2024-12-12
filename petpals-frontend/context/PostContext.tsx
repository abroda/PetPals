import React, { createContext, useContext, useState } from "react";
import {apiPaths} from "@/constants/config/api";
import {useAuth} from "@/hooks/useAuth";


// @ts-ignore
export const PostContext = createContext();

// @ts-ignore
export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]); // Global posts state
  const [responseMessage, setResponseMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const {authToken} = useAuth();

  // Fetch paginated posts
  // Fetch paginated posts
  const [fetchedPages, setFetchedPages] = useState(new Set()); // Track fetched pages

  const fetchPosts = async (page: number, size: number) => {
    console.log(`[PostContext] Fetching posts for page ${page}, size ${size}`);

    // Prevent fetching the same page multiple times
    if (fetchedPages.has(page)) {
      console.log(`[PostContext] Page ${page} is already fetched.`);
      return;
    }

    return sendJsonQuery(
      `${apiPaths.posts.getAllPosts}?page=${page}&size=${size}`,
      "GET",
      {},
      (payload) => {
        console.log(`[PostContext] Fetched posts for page ${page}:`, payload.content);

        // Append new posts to the global state
        setPosts((prevPosts) => [...prevPosts, ...payload.content]);

        // Update the total number of pages
        setTotalPages(payload.page?.totalPages || 1);

        // Track the fetched page
        setFetchedPages((prev) => new Set(prev).add(page));

        setResponseMessage("[PostContext] Fetched posts successfully!");
      },
      (payload) => {
        console.error("[PostContext] Failed to fetch posts:", payload.message);
        setResponseMessage("[PostContext] Failed to fetch posts: " + payload.message);
      }
    );
  };

  // Fetch post by ID
  const fetchPostById = async (id) => {
    console.log(`[PostContext] Fetching post with ID: ${id}`);

    const result = await sendJsonQuery(
      `${apiPaths.posts.getPostById(id)}`,
      "GET",
      {},
      (payload) => {
        //console.log(`[PostContext] Fetched post with ID ${id}:`, payload);
        return payload;
      },
      (errorPayload) => {
        console.error(`[PostContext] Failed to fetch post with ID: ${id}`, errorPayload);
        return null;
      }
    );

    return result;
  };

  // Add a new post
  const addPost = async (postData: any) => {
    console.log("[PostContext] Adding new post:", postData);

    return sendJsonQuery(
      apiPaths.posts.addPost,
      "POST",
      postData,
      (payload) => {
        console.log("[PostContext] Post added successfully:", payload);
        // @ts-ignore
        setPosts((prevPosts) => [payload, ...prevPosts]); // Add new post to the top of the list
        setResponseMessage("[PostContext] Post added successfully!");
      },
      (payload) => {
        console.error("[PostContext] Failed to add post:", payload.message);
        setResponseMessage("[PostContext] Failed to add post: " + payload.message);
      }
    );
  };

  // Edit a post
  const editPost = async (id: string, updatedData: any) => {
    console.log(`[PostContext] Editing post with ID: ${id}`, updatedData);

    return sendJsonQuery(
      apiPaths.posts.editPost(id),
      "PUT",
      updatedData,
      (payload) => {
        console.log("[PostContext] Post updated successfully:", payload);
        // @ts-ignore
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === id ? payload : post))
        );
        setResponseMessage("[PostContext] Post updated successfully!");
      },
      (payload) => {
        console.error(`[PostContext] Failed to update post with ID: ${id}`);
        setResponseMessage("[PostContext] Failed to update post: " + payload.message);
      }
    );
  };

  // Delete a post
  const deletePost = async (id: string) => {
    console.log(`[PostContext] Deleting post with ID: ${id}`);

    return sendJsonQuery(
      apiPaths.posts.deletePost(id),
      "DELETE",
      {},
      () => {
        console.log("[PostContext] Post deleted successfully");
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
        setResponseMessage("[PostContext] Post deleted successfully!");
      },
      (payload) => {
        console.error(`[PostContext] Failed to delete post with ID: ${id}`);
        setResponseMessage("[PostContext] Failed to delete post: " + payload.message);
      }
    );
  };


  const savePhoto = async (postId: string, formData: FormData) => {
    console.log(`[PostContext] Saving photo for post ID: ${postId}`);

    const path = apiPaths.posts.addPicture(postId); // Path for adding a picture

    return sendFileQuery(
      path,
      "PUT",
      formData,
      (payload) => {
        console.log("[PostContext] Photo saved successfully:", payload.imageUrl);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, imageUrl: payload.imageUrl } : post
          )
        );
        setResponseMessage("Photo saved successfully!");
      },
      (payload) => {
        console.error("[PostContext] Failed to save photo:", payload.message);
        console.log("FormData:", formData);
        setResponseMessage("Failed to save photo: " + payload.message);
      }
    );
  };


  // fetch comments
  const fetchComments = async (postId) => {
    console.log(`[PostContext] Fetching comments for post ID: ${postId}`);

    return sendJsonQuery(
      `${apiPaths.posts.comments.getByPostId(postId)}`,
      "GET",
      {},
      (payload) => {
        console.log(`[PostContext] Fetched comments for post ID ${postId}:`, payload);
        return payload; // Return the fetched comments
      },
      (payload) => {
        console.error(`[PostContext] Failed to fetch comments for post ID: ${postId}`);
        setResponseMessage(`[PostContext] Failed to fetch comments: ${payload.message}`);
        return [];
      }
    );
  };

  // Add comment
  const addComment = async (postId, commentContent) => {
    console.log(`[PostContext] Adding comment to post ID: ${postId}`);

    return sendJsonQuery(
      `${apiPaths.posts.comments.addComment(postId)}`,
      "POST",
      { content: commentContent },
      (payload) => {
        console.log(`[PostContext] Comment added to post ID ${postId}:`, payload);
        setResponseMessage("[PostContext] Comment added successfully!");
        return payload;
      },
      (payload) => {
        console.error(`[PostContext] Failed to add comment to post ID: ${postId}`);
        setResponseMessage(`[PostContext] Failed to add comment: ${payload.message}`);
        return null;
      }
    );
  };

  // Edit comment
  const editComment = async (commentId, updatedContent) => {
    console.log(`[PostContext] Editing comment with ID: ${commentId}`);

    return sendJsonQuery(
      `${apiPaths.posts.comments.editComment(commentId)}`,
      "PUT",
      { content: updatedContent },
      (payload) => {
        console.log(`[PostContext] Comment edited successfully: ${commentId}`, payload);
        setResponseMessage("[PostContext] Comment edited successfully!");
        return payload;
      },
      (payload) => {
        console.error(`[PostContext] Failed to edit comment with ID: ${commentId}`);
        setResponseMessage(`[PostContext] Failed to edit comment: ${payload.message}`);
        return null;
      }
    );
  };

  // Delete a comment
  const deleteComment = async (commentId) => {
    console.log(`[PostContext] Deleting comment with ID: ${commentId}`);

    return sendJsonQuery(
      `${apiPaths.posts.comments.deleteComment(commentId)}`,
      "DELETE",
      {},
      () => {
        console.log(`[PostContext] Comment deleted successfully: ${commentId}`);
        setResponseMessage("[PostContext] Comment deleted successfully!");
        return true;
      },
      (payload) => {
        console.error(`[PostContext] Failed to delete comment with ID: ${commentId}`);
        setResponseMessage(`[PostContext] Failed to delete comment: ${payload.message}`);
        return false;
      }
    );
  };

  // Like a post
  const toggleLikePost = async (postId) => {
    console.log(`[PostContext] Toggling like for post ID: ${postId}`);

    return sendJsonQuery(
      `${apiPaths.posts.toggleLikePost(postId)}`,
      "POST",
      {},
      (payload) => {
        console.log(`[PostContext] Toggled like for post ID ${postId}:`, payload);
        setResponseMessage("[PostContext] Toggled like successfully!");
        return true;
      },
      (payload) => {
        console.error(`[PostContext] Failed to toggle like for post ID: ${postId}`);
        setResponseMessage(`[PostContext] Failed to toggle like: ${payload.message}`);
        return false;
      }
    );
  };

  // Like a comment
  const toggleLikeComment = async (commentId) => {
    console.log(`[PostContext] Toggling like for comment ID: ${commentId}`);

    return sendJsonQuery(
      `${apiPaths.posts.comments.toggleLikeComment(commentId)}`,
      "POST",
      {},
      (payload) => {
        console.log(`[PostContext] Toggled like for comment ID ${commentId}:`, payload);
        setResponseMessage("[PostContext] Toggled like successfully!");
        return true;
      },
      (payload) => {
        console.error(`[PostContext] Failed to toggle like for comment ID: ${commentId}`);
        setResponseMessage(`[PostContext] Failed to toggle like: ${payload.message}`);
        return false;
      }
    );
  };

  // - - - - - Sending queries
  const sendFileQuery = async (
    path: string,
    method: string,
    file: File | Blob,
    onSuccess: (payload: any) => void,
    onFailure: (payload: any) => void
  ): Promise<boolean> => {
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(path, {
      method,
      headers: { Authorization: `Bearer ${authToken}` },
      body: formData,
    });
    setIsProcessing(false);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[PostContext] File upload error:", errorText);
      onFailure({ message: errorText });
      return false;
    }
    const payload = await response.json();
    onSuccess(payload);
    return true;
  };


  const sendJsonQuery = async (
    path,
    method = "GET",
    payload = {},
    onOKResponse = (payload) => {},
    onBadResponse = (errorPayload) => {},
    onError = (error) => {}
  ) => {
    try {
      console.log(`[PostContext | sendJsonQuery] Sending request to: ${path}`);
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      };

      if (method !== "GET") {
        options.body = JSON.stringify(payload);
      }

      const response = await fetch(path, options);

      if (response.ok) {
        const data = await response.json();
        onOKResponse(data); // Call the success handler
        return data; // Return the payload
      } else {
        const errorData = await response.json();
        onBadResponse(errorData); // Call the error handler
        return null; // Return null on bad response
      }
    } catch (error) {
      console.error("[PostContext | sendJsonQuery] Network error:", error);
      onError(error); // Call the error handler
      return null; // Return null on network error
    }
  };


  return (
    <PostContext.Provider
      value={{
        posts,
        totalPages,
        responseMessage,
        isProcessing,
        fetchPosts,
        fetchPostById,
        addPost,
        editPost,
        deletePost,
        savePhoto,
        fetchComments,
        addComment,
        editComment,
        deleteComment,
        toggleLikePost,
        toggleLikeComment,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  return useContext(PostContext);
};
