import React, {createContext, useContext, useState} from 'react';
import {Client, Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {ChatMessageResponse, useChat} from "@/context/ChatContext";
import {useAuth} from "@/hooks/useAuth";
import {websocketURL} from "@/constants/config/api";

type ChatContextType = {
    stompClient: Client | null;
    connectWebSocket: () => void;
    sendMessage: (chatroomId: string, inputMessage: string, setInputMessage: React.Dispatch<React.SetStateAction<string>>) => void;
};

const WebSocketContext = createContext<ChatContextType | null>(null);

export const WebSocketProvider = ({children}: { children: React.ReactNode }) => {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const {chats, setChatMessages, setLatestMessages} = useChat();
    const {authToken, userId} = useAuth()

    const connectWebSocket = () => {
        const client = new Client({
            webSocketFactory: () => new SockJS(websocketURL),
            connectHeaders: {
                Authorization: `Bearer ${authToken}`,
            },
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log('Connected to WebSocket');
                chats.forEach((chat) => {
                    client.subscribe(`/user/chat/${chat.chatroomId}`, (message) => {
                        console.log(`Message received for chatroom ${chat.chatroomId}:`, message.body);
                        const newMessage: ChatMessageResponse = JSON.parse(message.body);
                        handleNewMessage(chat.chatroomId, newMessage);
                    });
                });
            },
            onDisconnect: () => console.log('WebSocket disconnected'),
            onStompError: (frame) => {
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

    const sendMessage = (chatroomId: string, inputMessage: string, setInputMessage: React.Dispatch<React.SetStateAction<string>>) => {
        if (stompClient) {
            const messagePayload = {
                chatroomId,
                senderId: userId,
                content: inputMessage,
            };
            console.log("MESSAGE: " + messagePayload)
            stompClient.publish({
                destination: '/app/chat', // Maps to the `@MessageMapping("/chat")` endpoint
                body: JSON.stringify(messagePayload),
            });

            setInputMessage('');
        } else {
            console.log('WebSocket not connected');
        }
    };

    return (
        <WebSocketContext.Provider
            value={{
                stompClient,
                connectWebSocket,
                sendMessage,
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
