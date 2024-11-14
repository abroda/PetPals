import React, {createContext, FC, ReactNode, useState,} from "react";
import {apiPaths} from "@/constants/config/api";
import {useAuth} from "@/hooks/useAuth";
import {serverQuery} from "@/hooks/serverQuery";

export type PostContextType = {
    isProcessing: boolean;
    getFeed: (
        page: number,
        size: number,
        asyncAbortController?: AbortController
    ) => Promise<{ success: boolean; returnValue: any }>;
    getPostById: (
        postId: string,
        asyncAbortController?: AbortController
    ) => Promise<{ success: boolean; returnValue: any }>;
    likePostById: (
        postId: string,
        asyncAbortController?: AbortController
    ) => Promise<{ success: boolean; returnValue: any }>;
    removeLikePostById: (
        postId: string,
        asyncAbortController?: AbortController
    ) => Promise<{ success: boolean; returnValue: any }>;
    addPost: (
        title: string,
        description: string,
        asyncAbortController?: AbortController
    ) => Promise<{ success: boolean; returnValue: any }>;
};

export type PostType = {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    author: {
        id: string;
        username: string;
        imageUrl?: string;
    };
    comments: {
        commentId: string;
        content: string;
        createdAt: string;
        postId: string;
        commenter: {
            id: string;
            username: string;
            imageUrl: string;
        };
        likes: string[];
    }[];
    likes: string[];
};

export const PostContext = createContext<PostContextType | null>(null);

export const PostProvider: FC<{ children: ReactNode }> = ({children}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const {authToken, userId} = useAuth();

    const getFeed = async (
        page: number,
        size: number,
        asyncAbortController?: AbortController
    ) => {
        return await serverQuery({
            path: apiPaths.posts.getFeed + `?page=${page}&size=${size}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            payload: null,
            onStart: () => setIsProcessing(true),
            onEnd: () => setIsProcessing(false),
            asyncAbortController: asyncAbortController,
        });
    }

    const getPostById = async (
        postId: string,
        asyncAbortController?: AbortController
    ) => {
        return await serverQuery({
            path: apiPaths.posts.getPostById(postId),
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            payload: null,
            onStart: () => setIsProcessing(true),
            onEnd: () => setIsProcessing(false),
            asyncAbortController: asyncAbortController,
        });
    }

    const likePostById = async (
        postId: string,
        asyncAbortController?: AbortController
    ) => {
        return await serverQuery({
            path: apiPaths.posts.likePostById(postId),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            payload: {
                userId: userId
            },
            onStart: () => setIsProcessing(true),
            onEnd: () => setIsProcessing(false),
            asyncAbortController: asyncAbortController,
        });
    }

    const removeLikePostById = async (
        postId: string,
        asyncAbortController?: AbortController
    ) => {
        return await serverQuery({
            path: apiPaths.posts.likePostById(postId),
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            payload: {
                userId: userId
            },
            onStart: () => setIsProcessing(true),
            onEnd: () => setIsProcessing(false),
            asyncAbortController: asyncAbortController,
        });
    }

    const addPost = async (
        title: string,
        description: string,
        asyncAbortController?: AbortController
    ) => {
        return await serverQuery({
            path: apiPaths.posts.addPost,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            payload: {
                title: title,
                description: description,
                userId: userId
            },
            onStart: () => setIsProcessing(true),
            onEnd: () => setIsProcessing(false),
            asyncAbortController: asyncAbortController,
        });
    }

    return (
        <PostContext.Provider
            value={
                {
                    isProcessing,
                    getFeed,
                    getPostById,
                    likePostById,
                    removeLikePostById,
                    addPost
                }
            }
        >
            {children}
        </PostContext.Provider>
    );
};
