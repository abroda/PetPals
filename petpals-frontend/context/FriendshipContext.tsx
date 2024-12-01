import React, { createContext, FC, ReactNode, useContext, useState } from "react";
import { apiPaths } from "@/constants/config/api";
import { useAuth } from "@/hooks/useAuth";
import {AuthContext} from "@/context/AuthContext";


export type FriendshipRequest = {
  id: string;
  senderId: string;
  senderUsername: string;
  receiverId: string;
  receiverUsername: string;
  status: "PENDING" | "ACCEPTED" | "DENIED";
};

export type Friend = {
  id: string;
  username: string;
  description: string;
  imageUrl?: string;
  visibility: string;
};

type FriendshipContextType = {
  getFriendRequests: (userId: string) => Promise<FriendshipRequest[]>;
  sendFriendRequest: (senderId: string, receiverId: string) => Promise<boolean>;
  acceptFriendRequest: (requestId: string) => Promise<boolean>;
  denyFriendRequest: (requestId: string) => Promise<boolean>;
  removePendingFriendRequest: (requestId: string) => Promise<boolean>;
  removeFriend: (userId: string, friendId: string) => Promise<boolean>;
  getFriends: (userId: string) => Promise<Friend[]>;
  refreshRequests: () => Promise<void>;
  sentRequests: FriendshipRequest[];
  receivedRequests: FriendshipRequest[];
};

export const FriendshipContext = createContext<FriendshipContextType | null>(null);

export const FriendshipProvider: FC<{ children: ReactNode }> = ({ children }) => {

  const { authToken, userId } = useAuth();
  const [sentRequests, setSentRequests] = useState<FriendshipRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendshipRequest[]>([]);

  const [isProcessing, setIsProcessing] = useState(false);



  // JSON request function with error handling
  const sendJsonQuery = async (
    path: string,
    method: string,
    payload?: any
  ): Promise<any> => {
    setIsProcessing(true);

    const headers = new Headers({
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    });

    const response = await fetch(path, {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
    });

    setIsProcessing(false);

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  };


  // Function to refresh al requests (sent & received) for currently logged in user - USE GLOBALLY!
  const refreshRequests = async () => {
    if (userId) {
      await getFriendRequests(userId);
    }
  };

  const getFriendRequests = async (userId: string) => {
    const requests: FriendshipRequest[] = await sendJsonQuery(apiPaths.friends.getRequests(userId), "GET");
    const received = requests.filter((request) => request.receiverId === userId);
    const sent = requests.filter((request) => request.senderId === userId);
    setReceivedRequests(received);
    setSentRequests(sent);
  };

  const sendFriendRequest = async (senderId: string, receiverId: string): Promise<boolean> => {
    const response = await sendJsonQuery(apiPaths.friends.sendRequest, "POST", {
      senderId,
      receiverId,
    });
    await refreshRequests();
    return !!response;
  };

  const acceptFriendRequest = async (requestId: string): Promise<boolean> => {
    const response = await sendJsonQuery(apiPaths.friends.acceptRequest(requestId), "POST");
    await refreshRequests();
    return !!response;
  };

  const denyFriendRequest = async (requestId: string): Promise<boolean> => {
    const response = await sendJsonQuery(apiPaths.friends.denyRequest(requestId), "POST");
    await refreshRequests();
    return !!response;
  };

  const removePendingFriendRequest = async (requestId: string): Promise<boolean> => {
    try {
      await sendJsonQuery(apiPaths.friends.removePendingRequest(requestId), "DELETE");
      await refreshRequests();
      return true;
    } catch (error) {
      console.error("Failed to remove pending friend request:", error);
      return false;
    }
  };

  const removeFriend = async (userId: string, friendId: string): Promise<boolean> => {
    const response = await sendJsonQuery(apiPaths.friends.removeFriend, "DELETE", {
      userId,
      friendId,
    });
    await refreshRequests();
    return !!response;
  };

  const getFriends = async (userId: string): Promise<Friend[]> => {
    const response = await sendJsonQuery(apiPaths.friends.getFriends(userId), "GET");
    return response || [];
  };

  return (
    <FriendshipContext.Provider
      value={{
        getFriendRequests,
        sendFriendRequest,
        acceptFriendRequest,
        denyFriendRequest,
        removePendingFriendRequest,
        removeFriend,
        getFriends,
        refreshRequests,
        sentRequests,
        receivedRequests,
      }}
    >
      {children}
    </FriendshipContext.Provider>
  );
};

export const useFriendship = () => {
  const context = useContext(FriendshipContext);
  if (!context) {
    throw new Error("useFriendship must be used within a FriendshipProvider");
  }
  return context;
};
