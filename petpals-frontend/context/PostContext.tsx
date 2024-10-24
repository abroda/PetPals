import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { apiPaths } from "@/constants/config/api";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import { Dictionary } from "react-native-ui-lib/src/typings/common";
import { useAuth } from "@/hooks/useAuth";

export type PostContextType = {
  // isProcessing: boolean;
  // responseMessage: string;
  // getFeed: (username: string) => Promise<boolean>; // for home page
  // getPosts: (username: string) => Promise<boolean>; // for profile
  // getPost: (username: string) => Promise<boolean>;
  // addPost: (username: string, data: Object) => Promise<boolean>;
  // editPost: (postId: string, data: Object) => Promise<boolean>;
  // removePost: (postId: string) => Promise<boolean>;
  // addReaction: (username: string, reaction: string) => Promise<boolean>;
  // removeReaction: (username: string, reaction: string) => Promise<boolean>;
  // addComment: (
  //   username: string,
  //   postId: string,
  //   contents: string
  // ) => Promise<boolean>;
  // removeComment: (commentId: string) => Promise<boolean>;
};

export const PostContext = createContext<PostContextType | null>(null);

export const PostProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const { userEmail } = useAuth();

  const sendJsonQuery = async (
    path: string,
    method: string = "POST",
    payload: any = {},
    onOKResponse: (payload: any) => void = (payload: any) =>
      setResponseMessage("OK: " + payload.message),
    onBadResponse: (payload: any) => void = (payload: any) =>
      setResponseMessage("Server error: " + payload.message),
    onJSONParseError: (reason: any) => void = (reason: any) =>
      setResponseMessage("JSON parse error: " + reason),
    onError: (error: Error) => void = (error: Error) =>
      setResponseMessage("Fetch error: " + error.message)
  ) => {
    setResponseMessage("");
    setIsProcessing(true);
    const { authToken } = useAuth();

    return fetch(path, {
      method: method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response: Response) => {
        return response
          .json()
          .then((payload) => {
            if (response.ok) {
              onOKResponse(payload);
              setIsProcessing(false);
              return true;
            } else {
              onBadResponse(payload);
              setIsProcessing(false);
              return false;
            }
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

  const getFeed = async (username: string) =>
    sendJsonQuery(apiPaths.auth.register, "POST", {
      username: username,
    });

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

  const addPost = async (username: string, data: Object) =>
    sendJsonQuery(apiPaths.auth.sendPasswordResetCode, "POST", {
      username: username,
    });

  const editPost = async (postId: string, data: Object) =>
    sendJsonQuery(apiPaths.auth.resetPassword, "POST", {
      postId: postId,
    });

  const removePost = async (postId: string) =>
    sendJsonQuery(apiPaths.auth.resetPassword, "POST", {
      postId: postId,
    });

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

  const removeReaction = async (username: string, reaction: string) =>
    sendJsonQuery(apiPaths.auth.login, "POST", {
      email: username,
      password: reaction,
    });

  const addComment = async (
    username: string,
    postId: string,
    contents: string
  ) => {
    return true;
  };

  const removeComment = async (commentId: string) => {
    return true;
  };

  return (
    <PostContext.Provider
      value={
        {
          // isProcessing,
          // responseMessage,
          // getFeed,
          // getPosts,
          // getPost,
          // addPost,
          // editPost,
          // removePost,
          // addReaction,
          // removeReaction,
          // addComment,
          // removeComment,
        }
      }
    >
      {children}
    </PostContext.Provider>
  );
};
