import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { apiPaths } from "@/constants/config/API";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import { Dictionary } from "react-native-ui-lib/src/typings/common";
import { useAuth } from "@/hooks/useAuth";

// TODO

export type PostContextType = {
  isProcessing: boolean;
  responseMessage: string;
  getFeed: (username: string) => Promise<boolean>;
  getPosts: (username: string) => Promise<boolean>;
  getPost: (username: string) => Promise<boolean>;
  addPost: (username: string, data: Object) => Promise<boolean>;
  editPost: (postId: string, data: Object) => Promise<boolean>;
  removePost: (postId: string) => Promise<boolean>;
  addReaction: (username: string, reaction: string) => Promise<boolean>;
  removeReaction: (username: string, reaction: string) => Promise<boolean>;
  addComment: (
    username: string,
    postId: string,
    contents: string
  ) => Promise<boolean>;
  removeComment: (commentId: string) => Promise<boolean>;
};

export const PostContext = createContext<PostContextType | null>(null);

export const PostProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const { userEmail } = useAuth();

  const sendJsonQuery = (path: string, method: string, payload?: any) =>
    fetch(path, {
      method: method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((response) => response.json());

  const getFeed = async (username: string) => {
    setIsProcessing(true);
    setResponseMessage("");

    return sendJsonQuery(apiPaths.auth.register, "POST", {
      username: username,
    })
      .then((response: Dictionary<any>) => {
        setIsProcessing(false);
        return true;
      })
      .catch((err: Error) => {
        console.error("Register: " + err.message);
        setResponseMessage("Register: error");
        setIsProcessing(false);
        return false;
      });
  };

  const getPosts = async (username: string) => {
    setIsProcessing(true);
    setResponseMessage("");

    return sendJsonQuery(apiPaths.auth.verifyEmail, "POST", {
      username: username,
    })
      .then((_) => {
        setIsProcessing(false);
        return true;
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage("Verify email: " + err.message);
        setIsProcessing(false);
        return false;
      });
  };

  const getPost = async (postId: string) => {
    setIsProcessing(true);
    setResponseMessage("");

    return sendJsonQuery(apiPaths.auth.verifyEmail, "POST", postId)
      .then((_) => {
        setIsProcessing(false);
        return true;
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage("Resend verification: " + err.message);
        setIsProcessing(false);
        return false;
      });
  };

  const addPost = async (username: string, data: Object) => {
    setIsProcessing(true);
    setResponseMessage("");

    return sendJsonQuery(apiPaths.auth.requestPasswordReset, "POST", {
      username: username,
    })
      .then((response: string) => {
        setIsProcessing(false);
        return true;
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage("Request password reset: " + err.message);
        setIsProcessing(false);
        return false;
      });
  };

  const editPost = async (postId: string, data: Object) => {
    setIsProcessing(true);
    setResponseMessage("");

    return sendJsonQuery(apiPaths.auth.confirmPasswordReset, "POST", {
      postId: postId,
    })
      .then((response: string) => {
        setIsProcessing(false);
        return true;
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage("Confirm password reset: " + err.message);
        setIsProcessing(false);
        return false;
      });
  };

  const removePost = async (postId: string) => {
    setIsProcessing(true);
    setResponseMessage("");

    return sendJsonQuery(apiPaths.auth.resetPassword, "POST", {
      postId: postId,
    })
      .then((response: Dictionary<any>) => {
        setIsProcessing(false);
        return true;
      })
      .catch((err: Error) => {
        console.error("Reset password: " + err.message);
        setIsProcessing(false);
        return false;
      });
  };

  const addReaction = async (username: string, reaction: string) => {
    setIsProcessing(true);
    setResponseMessage("");

    return asyncStorage
      .getItem("authToken")
      .then((token: string | null) => {
        setIsProcessing(false);
        return true;
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage("Check saved login: " + err.message);
        setIsProcessing(false);
        return false;
      });
  };

  const removeReaction = async (username: string, reaction: string) => {
    setIsProcessing(true);
    setResponseMessage("");

    return sendJsonQuery(apiPaths.auth.login, "POST", {
      email: username,
      password: reaction,
    })
      .then((response: Dictionary<any>) => {
        setIsProcessing(false);
        return true;
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage("Login: " + err.message);
        setIsProcessing(false);
        return false;
      });
  };

  const addComment = async (
    username: string,
    postId: string,
    contents: string
  ) => {
    setIsProcessing(true);
    setResponseMessage("");

    return true;
  };

  const removeComment = async (commentId: string) => {
    setIsProcessing(true);
    setResponseMessage("");

    return true;
  };

  return (
    <PostContext.Provider
      value={{
        isProcessing,
        responseMessage,
        getFeed,
        getPosts,
        getPost,
        addPost,
        editPost,
        removePost,
        addReaction,
        removeReaction,
        addComment,
        removeComment,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
