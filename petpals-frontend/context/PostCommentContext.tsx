import React, { createContext, useContext, useState } from "react";
import {useAuth} from "@/hooks/useAuth";
import {apiPaths} from "@/constants/config/api";

const PostCommentContext = createContext();

export const usePostComment = () => useContext(PostCommentContext);

export const PostCommentProvider = ({ children }) => {
  const [responseMessage, setResponseMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const {authToken} = useAuth();


  const sendJsonQuery = async (
    path: string,
    method: string = "POST",
    payload: any = {},

    onOKResponse: (payload: any) => void = (payload: any) => {
      setResponseMessage("OK: " + payload.message);
      console.log("OK: ", payload);
    },

    onBadResponse: (payload: any) => void = (payload: any) => {
      setResponseMessage("Server error: " + payload.message);
      console.log("NOT OK: ", payload);
    },

    onJSONParseError: (reason: any) => void = (reason: any) => {
      setResponseMessage("JSON parse error: " + reason);
      console.log("JSON Parse error: ", reason);
    },

    onError: (error: Error) => void = (error: Error) => {
      setResponseMessage("Fetch error: " + error.message);
      console.log("ERROR: ", error);
    }
  ) => {
    setResponseMessage("");
    setIsProcessing(true);

    console.log(`Sending request to: ${path} with method: ${method}`);
    console.log("Payload:", payload);

    const options: RequestInit = {
      method: method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    };

    if (method !== "GET") {
      options.body = JSON.stringify(payload);
    }

    return fetch(path, options)
      .then((response: Response) => {
        //console.log("Raw response received:", response);

        // Check if there is content to parse
        if (!response.ok) {
          return response.text().then((text) => {
            console.log("Error Response Text: ", text);
            onBadResponse({ message: text || response.statusText });
            return false;
          });
        }

        // If response has no content (like 204 No Content), don't try to parse JSON
        if (
          response.status === 204 ||
          response.headers.get("Content-Length") === "0"
        ) {
          console.log("No content to parse");
          onOKResponse({});
          setIsProcessing(false);
          return true;
        }

        return response
          .json()
          .then((payload) => {
            onOKResponse(payload);
            setIsProcessing(false);
            return true;
          })
          .catch((reason) => {
            onJSONParseError(reason);
            setIsProcessing(false);
            return false;
          });
      })
      .catch((error: Error) => {
        onError(error);
        setIsProcessing(false);
        return false;
      });
  };




  const getAllPostComments = async () => {
    return sendJsonQuery(apiPaths.posts.comments.getAll, "GET");
  };

  const getPostCommentsByPostId = async (postId: string) => {
    return sendJsonQuery(apiPaths.posts.comments.getByPostId(postId), "GET");
  };

  const getPostCommentById = async (commentId: string) => {
    return sendJsonQuery(apiPaths.posts.comments.getById(commentId), "GET");
  };

  const addPostComment = async (postId: string, commentData: { content: string; userId: string }) => {
    return sendJsonQuery(apiPaths.posts.comments.add(postId), "POST", commentData);
  };

  const editPostComment = async (commentId: string, commentData: { content: string }) => {
    return sendJsonQuery(apiPaths.posts.comments.edit(commentId), "PUT", commentData);
  };

  const deletePostComment = async (commentId: string) => {
    return sendJsonQuery(apiPaths.posts.comments.delete(commentId), "DELETE");
  };

  const likePostComment = async (commentId: string, userId: string) => {
    return sendJsonQuery(apiPaths.posts.comments.like(commentId), "POST", { userId });
  };

  const unlikePostComment = async (commentId: string, userId: string) => {
    return sendJsonQuery(apiPaths.posts.comments.unlike(commentId), "DELETE", { userId });
  };

  return (
    <PostCommentContext.Provider
      value={{
        getAllPostComments,
        getPostCommentsByPostId,
        getPostCommentById,
        addPostComment,
        editPostComment,
        deletePostComment,
        likePostComment,
        unlikePostComment,
        responseMessage,
        isProcessing,
      }}
    >
      {children}
    </PostCommentContext.Provider>
  );
};
