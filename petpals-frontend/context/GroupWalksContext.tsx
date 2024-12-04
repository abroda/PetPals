import React, { createContext, FC, ReactNode, useState } from "react";
import { apiPaths } from "@/constants/config/api";
import { serverQuery } from "@/helpers/serverQuery";
import { useAuth } from "@/hooks/useAuth";

export type Participant = {
  userId: string;
  username: string;
  imageURL?: string;
  dogsCount?: number;
  friendsCount?: number;
  dogs?: { dogId: string; name: string; imageUrl?: string }[];
};

export type GroupWalkTag = string;
export const tagRegex = '^[^!@#$%^&*(),.?":{}|<>;+]{2,}$';

export type CommentContent = {
  id: string;
  creator: Participant;
  content: string;
  liked: boolean;
  likes: number;
};

export type GroupWalk = {
  id: string;
  creator: Participant;
  title: string;
  description: string;
  datetime: Date;
  locationName: string;
  latitude: number;
  longitude: number;
  tags: GroupWalkTag[];
  participants: Participant[];
};

export type PageInfo = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

export type PagedGroupWalks = {
  content: GroupWalk[];
  page: PageInfo;
};

export type GroupWalksContextType = {
  getGroupWalk: (
    walkId: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  createGroupWalk: (
    data: GroupWalk | any,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  updateGroupWalk: (
    walkId: string,
    data: GroupWalk | any,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  deleteGroupWalk: (
    walkId: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  joinGroupWalk: (
    walkId: string,
    data: any,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  leaveGroupWalk: (
    walkId: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  getUsersDogs: (
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  getTagSuggestions: (
    input: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  getGroupWalks: (
    from: "joined" | "created",
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  findGroupWalks: (
    tags: GroupWalkTag[],
    page: number,
    elementsOnPage: number,
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

export const GroupWalksContext = createContext<GroupWalksContextType | null>(
  null
);

export const GroupWalksProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [recordingWalk, setRecordingWalk] = useState(false);
  const [walkStartTime, setWalkStartTime] = useState(null);
  const [distanceWalked, setDistanceWalked] = useState(0);
  const [currentPath, setCurrentPath] = useState([]);

  const { userId, authToken } = useAuth();

  const getGroupWalk = async (
    walkId: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.groupWalks.walk(walkId),
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
      asyncAbortController: asyncAbortController,
    });
  };

  const createGroupWalk = async (
    data: any,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.groupWalks.create,
      payload: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
      asyncAbortController: asyncAbortController,
    });
  };

  const updateGroupWalk = async (
    walkId: string,
    data: any,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.groupWalks.walk(walkId),
      method: "PUT",
      payload: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
      asyncAbortController: asyncAbortController,
    });
  };

  const joinGroupWalk = async (
    walkId: string,
    data: any,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.groupWalks.join(walkId),
      payload: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
      asyncAbortController: asyncAbortController,
    });
  };

  const leaveGroupWalk = async (
    walkId: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.groupWalks.leave(walkId),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
      asyncAbortController: asyncAbortController,
    });
  };

  const getUsersDogs = async (asyncAbortController?: AbortController) => {
    return serverQuery({
      path: apiPaths.groupWalks.listUsersDogs(userId ?? ""),
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
      asyncAbortController: asyncAbortController,
    });
  };

  const getTagSuggestions = async (
    input: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.groupWalks.tagSuggestions(input),
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
      asyncAbortController: asyncAbortController,
    });
  };

  const getGroupWalks = async (
    from: "created" | "joined",
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path:
        from === "created"
          ? apiPaths.groupWalks.listCreated(userId ?? "")
          : apiPaths.groupWalks.listJoined(userId ?? ""),
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
      asyncAbortController: asyncAbortController,
    });
  };

  const findGroupWalks = async (
    tags: GroupWalkTag[],
    page: number,
    elementsOnPage: number,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.groupWalks.list(page, elementsOnPage, tags),
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
      asyncAbortController: asyncAbortController,
    });
  };

  return (
    <GroupWalksContext.Provider
      value={{
        getGroupWalk,
        createGroupWalk,
        updateGroupWalk,
        deleteGroupWalk,
        joinGroupWalk,
        leaveGroupWalk,
        getUsersDogs,
        getTagSuggestions,
        getGroupWalks,
        findGroupWalks,
        addGroupWalkComment,
        deleteGroupWalkComment,
        toggleLikeOnGroupWalkComment,
      }}
    >
      {children}
    </GroupWalksContext.Provider>
  );
};
