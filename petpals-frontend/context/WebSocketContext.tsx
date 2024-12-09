import React, {createContext, useContext, useState} from 'react';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {ChatMessageResponse, ChatroomResponse, useChat} from "@/context/ChatContext";
import {useAuth} from "@/hooks/useAuth";
import {apiPaths, websocketURL} from "@/constants/config/api";

type ChatContextType = {
    stompClient: Client | null;
    connectWebSocket: () => void;
};

const WebSocketContext = createContext<ChatContextType | null>(null);

export const WebSocketProvider = ({children}: { children: React.ReactNode }) => {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const { chats, setChatMessages, setLatestMessages } = useChat();
    const {authToken} = useAuth()

    const connectWebSocket = () => {
        const client = new Client({
            webSocketFactory: () => new SockJS(websocketURL),
            connectHeaders: {
                Authorization: `Bearer ${authToken}`,
            },
            debug: (str: any) => console.log(str),
            onConnect: () => {
                console.log('Connected to WebSocket');
                chats.forEach((chat) => {
                    client.subscribe(`/user/chat/${chat.chatroomId}`, (message : any) => {
                        console.log(`Message received for chatroom ${chat.chatroomId}:`, message.body);
                        const newMessage: ChatMessageResponse = JSON.parse(message.body);
                        handleNewMessage(chat.chatroomId, newMessage);
                    });
                });
            },
            onDisconnect: () => console.log('WebSocket disconnected'),
            onStompError: (frame: any) => {
                console.error('STOMP error:', frame);
            },
        });
        client.activate();
        setStompClient(client);
    };

    const handleNewMessage = (chatId: string, newMessage: ChatMessageResponse) => {
        console.log("NEW MESSAGE PUSHED TO MESSAGE STATE")
        // @ts-ignore
        setChatMessages((prev) => ({
            ...prev,
            [chatId]: [newMessage, ...(prev[chatId] || [])],
        }));
        // @ts-ignore
        setLatestMessages((prev) => ({
            ...prev,
            [chatId]: newMessage,
        }));
    };

    return (
        <WebSocketContext.Provider
            value={{
                stompClient,
                connectWebSocket
            }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};
