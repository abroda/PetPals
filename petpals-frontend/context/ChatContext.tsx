import React, {createContext, FC, ReactNode, useContext, useState} from "react";
import {apiPaths} from "@/constants/config/api";
import {serverQuery} from "@/helpers/serverQuery";
import {useAuth} from "@/hooks/useAuth";

// ChatMessageResponse.ts
export type ChatMessageResponse = {
    content: string;
    sendAt: string;
    sender: ChatroomParticipant;
}

// ChatroomResponse.ts
export type ChatroomResponse = {
    chatroomId: string;
    participants: ChatroomParticipant[];
}

export type ChatroomParticipant = {
    id: string;
    username: string;
    imageUrl: string;
}

export type LatestMessageResponse = {
    chatroomId: string;
    latestMessage?: ChatMessageResponse; // Optional, as a chatroom may not have messages
}

export interface ChatMessagePage {
    content: ChatMessageResponse[];
    page: PageData;
}

export interface PageData {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}

export type ChatContextType = {
    chats: ChatroomResponse[];
    setChats: React.Dispatch<React.SetStateAction<ChatroomResponse[]>>;
    chatMessages: Record<string, ChatMessageResponse[]>;
    setChatMessages: React.Dispatch<Record<string, ChatMessageResponse[]>>;
    latestMessages: Record<string, ChatMessageResponse | null>;
    setLatestMessages: React.Dispatch<Record<string, ChatMessageResponse | null>>;
    getChats: () => void;
    fetchMessages: (hasMore: boolean, setHasMore: React.Dispatch<boolean>, page: number, chatroomId: string, setIsLoading: React.Dispatch<boolean>, reset: boolean) => void;
};

export const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: FC<{ children: ReactNode }> = ({children}) => {
    const {userId, authToken} = useAuth();
    const [chats, setChats] = useState<ChatroomResponse[]>([]);
    const [chatMessages, setChatMessages] = useState<Record<string, ChatMessageResponse[]>>({});
    const [latestMessages, setLatestMessages] = useState<Record<string, ChatMessageResponse | null>>({});

    const getChats = async () => {
        const response = await serverQuery({
            path: apiPaths.chats.chatrooms,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken ?? ""}`,
            },
        });
        const chatData: ChatroomResponse[] = await response.returnValue;
        setChats(chatData)
        let lastMessagePath = ""
        chatData.forEach((chat: ChatroomResponse) => {
            if (lastMessagePath == "") {
                lastMessagePath += `?chatroomIds=${chat.chatroomId}`
            } else {
                lastMessagePath += `&chatroomIds=${chat.chatroomId}`
            }
        })
        await getLatestMessages(lastMessagePath).then((res: Record<string, ChatMessageResponse | null>) => {
            setLatestMessages(res)
        })
    }

    const getLatestMessages = async (lastMessagePath: string) => {
        const response = await serverQuery({
            path: apiPaths.chats.latestMessages + lastMessagePath,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken ?? ""}`,
            },
        });
        const latestResponses: LatestMessageResponse[] = await response.returnValue;
        const latestMessagesMap: Record<string, ChatMessageResponse | null> = {};
        latestResponses.forEach((item: LatestMessageResponse) => {
            latestMessagesMap[item.chatroomId] = item.latestMessage || null;
        });
        return latestMessagesMap
    }

    const fetchMessages = async (hasMore: boolean, setHasMore: React.Dispatch<boolean>, page: number, chatroomId: string, setIsLoading: React.Dispatch<boolean>, reset: boolean) => {
        if (!hasMore) return;
        setIsLoading(true);
        try {
            const response = await serverQuery({
                path: apiPaths.chats.messages(chatroomId) + `?page=${page}&size=15&sort=sentAt,asc`,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken ?? ""}`,
                },
            });
            const data: ChatMessagePage = await response.returnValue;
            console.log(data)
            if (data.content.length > 0) {
                const updatedMessages = {...chatMessages};
                updatedMessages[chatroomId] = reset
                    ? data.content
                    : [...(chatMessages[chatroomId] || []), ...data.content];

                setChatMessages(updatedMessages)

            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ChatContext.Provider
            value={{
                chats,
                setChats,
                chatMessages,
                setChatMessages,
                latestMessages,
                setLatestMessages,
                getChats,
                fetchMessages
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
