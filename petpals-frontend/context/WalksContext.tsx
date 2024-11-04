import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { apiPaths } from "@/constants/config/api";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import { serverQuery } from "@/hooks/serverQuery";
import { useAuth } from "@/hooks/useAuth";

export type Participant = {
  id: string;
  name: string;
  avatarURL: string;
};

export type GroupWalkTag = string;
export const tagRegex = '^[^!@#$%^&*(),.?":{}|<>]*$';

export type CommentContent = {
  id: string;
  creator: Participant;
  content: string;
  liked: boolean;
};

export type GroupWalk = {
  id: string;
  creator: Participant;
  title: string;
  description: string;
  datetime: Date;
  location: string;
  tags: GroupWalkTag[];
  participantsCount: number;
  petsCount: number; // needed?
  joinedWithPets: Participant[]; // empty = not joined
};
// - will pull comments separately to speed up page load
//comments: Comment[];
// participants: Participant[]; // needed?
// petsParticipating: Participant[]; // needed?

export type WalksContextType = {
  isProcessing: boolean;
  getGroupWalk: (
    walkId: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  createGroupWalk: (
    data: GroupWalk,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  updateGroupWalk: (
    walkId: string,
    data: GroupWalk,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  deleteGroupWalk: (
    walkId: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  joinGroupWalk: (
    walkId: string,
    joinedWithPets: string[],
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  leaveGroupWalk: (
    walkId: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  getGroupWalkTags: (
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  getGroupWalkList: (
    from: "all" | "joined" | "created",
    tags: GroupWalkTag[],
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  addGroupWalkComment: (
    walkId: string,
    data: CommentContent,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  deleteGroupWalkComment: (
    walkId: string,
    commentId: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  toggleLikeOnGroupWalkComment: (
    walkId: string,
    commentId: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
};

export const WalksContext = createContext<WalksContextType | null>(null);

export const WalksProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { userId } = useAuth();

  const getGroupWalk = async (
    walkId: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.groupWalks.walk(walkId),
      method: "GET",
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
      asyncAbortController: asyncAbortController,
    });
  };

  const createGroupWalk = async (
    data: GroupWalk,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.groupWalks.create,
      payload: data,
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
      asyncAbortController: asyncAbortController,
    });
  };

  const updateGroupWalk = async (
    walkId: string,
    data: GroupWalk,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.groupWalks.walk(walkId),
      method: "PUT",
      payload: data,
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
      asyncAbortController: asyncAbortController,
    });
  };

  const deleteGroupWalk = async (
    walkId: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.groupWalks.walk(walkId),
      method: "DELETE",
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
      asyncAbortController: asyncAbortController,
    });
  };

  const joinGroupWalk = async (
    walkId: string,
    joinedWithPets: string[],
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.groupWalks.join(walkId),
      payload: joinedWithPets,
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
      asyncAbortController: asyncAbortController,
    });
  };

  const leaveGroupWalk = async (
    walkId: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.groupWalks.leave(walkId),
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
      asyncAbortController: asyncAbortController,
    });
  };

  const getGroupWalkTags = async (asyncAbortController?: AbortController) => {
    return serverQuery({
      path: apiPaths.groupWalks.walkTags,
      method: "GET",
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
      asyncAbortController: asyncAbortController,
    });
  };

  const getGroupWalkList = async (
    from: "all" | "joined" | "created",
    tags: GroupWalkTag[],
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path:
        from === "all"
          ? apiPaths.groupWalks.list(tags)
          : from === "created"
          ? apiPaths.groupWalks.listCreated(userId ?? "")
          : apiPaths.groupWalks.listJoined(userId ?? ""),
      method: "GET",
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
      asyncAbortController: asyncAbortController,
    });
  };

  const addGroupWalkComment = async (
    walkId: string,
    data: CommentContent,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.groupWalks.addComment(walkId),
      payload: data,
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
      asyncAbortController: asyncAbortController,
    });
  };
  const deleteGroupWalkComment = async (
    walkId: string,
    commentId: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.groupWalks.comment(walkId, commentId),
      method: "DELETE",
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
      asyncAbortController: asyncAbortController,
    });
  };

  const toggleLikeOnGroupWalkComment = async (
    walkId: string,
    commentId: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.groupWalks.commentToggleLike(walkId, commentId),
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
      asyncAbortController: asyncAbortController,
    });
  };

  return (
    <WalksContext.Provider
      value={{
        isProcessing,
        getGroupWalk,
        createGroupWalk,
        updateGroupWalk,
        deleteGroupWalk,
        joinGroupWalk,
        leaveGroupWalk,
        getGroupWalkTags,
        getGroupWalkList,
        addGroupWalkComment,
        deleteGroupWalkComment,
        toggleLikeOnGroupWalkComment,
      }}
    >
      {children}
    </WalksContext.Provider>
  );
};
