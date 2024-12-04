import React, { createContext, FC, ReactNode, useState } from "react";
import { apiPaths } from "@/constants/config/api";
import { serverQuery } from "@/helpers/serverQuery";
import { useAuth } from "@/hooks/useAuth";

export type MapPosition = {
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
};

export type PathVertex = {
  latitude: number;
  longitude: number;
  timestamp: Date;
};

export type WalksContextType = {
  startWalk: (
    latitude: number,
    longitude: number,
    dogsParticipating: string[],
    walkId?: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  pauseWalk: (
    latitude: number,
    longitude: number,
    walkId?: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  endWalk: (
    latitude: number,
    longitude: number,
    walkId?: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  sendLocation: (
    latitude: number,
    longitude: number,
    walkId?: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  getActiveUsers: (
    latitude: number,
    longitude: number,
    walkId?: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
};

export const WalksContext = createContext<WalksContextType | null>(null);

export const WalksProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { userId, authToken } = useAuth();

  const startWalk = async (
    latitude: number,
    longitude: number,
    dogsParticipating: string[],
    walkId?: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.walks.start,
      payload: {
        userId: userId,
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date(),
        dogsParticipating: dogsParticipating,
        walkId: walkId ?? null,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
      asyncAbortController: asyncAbortController,
    });
  };

  const pauseWalk = async (
    latitude: number,
    longitude: number,
    walkId?: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.walks.pause,
      payload: {
        userId: userId,
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date(),
        walkId: walkId ?? null,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
      asyncAbortController: asyncAbortController,
    });
  };

  const endWalk = async (
    latitude: number,
    longitude: number,
    walkId?: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.walks.end,
      payload: {
        userId: userId,
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date(),
        walkId: walkId ?? null,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
      asyncAbortController: asyncAbortController,
    });
  };

  const sendLocation = async (
    latitude: number,
    longitude: number,
    walkId?: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.walks.sendLocation,
      payload: {
        userId: userId,
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date(),
        walkId: walkId ?? null,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
      asyncAbortController: asyncAbortController,
    });
  };

  const getActiveUsers = async (
    latitude: number,
    longitude: number,
    walkId?: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.walks.sendLocation,
      payload: {
        userId: userId,
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date(),
        walkId: walkId ?? null,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
      asyncAbortController: asyncAbortController,
    });
  };

  return (
    <WalksContext.Provider
      value={{
        startWalk,
        pauseWalk,
        endWalk,
        sendLocation,
        getActiveUsers,
      }}
    >
      {children}
    </WalksContext.Provider>
  );
};
