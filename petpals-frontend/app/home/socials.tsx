import {FlatList, View} from "react-native";
import {ThemedView} from "@/components/basic/containers/ThemedView";
import {Picker, SegmentedControl} from "react-native-ui-lib";
import FriendListItem from "@/components/display/FriendListItem";
import FriendRequestListItem from "@/components/display/FriendRequestListItem";
import AppHeader from "@/components/decorations/static/AppHeader";

import {useEffect, useState} from "react";
import {useThemeColor} from "@/hooks/theme/useThemeColor";
import {SafeAreaView} from "react-native-safe-area-context";
import {useWindowDimension} from "@/hooks/theme/useWindowDimension";
import {widthPercentageToDP} from "react-native-responsive-screen";

import {useFriendship} from "@/context/FriendshipContext";
import {useAuth} from "@/hooks/useAuth";
import {ThemedText} from "@/components/basic/ThemedText";

import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {ThemeColors} from "@/constants/theme/Colors";
import {useTextStyle} from "@/hooks/theme/useTextStyle";
import {useWebSocket} from "@/context/WebSocketContext";
import {useChat} from "@/context/ChatContext";
import ChatItem from "@/components/display/Chat";
import {usePathname} from "expo-router";

import RNPickerSelect from 'react-native-picker-select';
import {ThemedButton} from "@/components/inputs/ThemedButton";
import HorizontalView from "@/components/basic/containers/HorizontalView";

export default function FriendsScreen() {
    const {getFriendRequests, getFriends} = useFriendship();
    const {userId, authToken} = useAuth(); // Assuming logged-in user's ID
    const pathname = usePathname();
    // States
    const {receivedRequests, sentRequests, refreshRequests, friends} = useFriendship();
    const [currentTab, setCurrentTab] = useState(0);
    const [currentRequestTab, setCurrentRequestTab] = useState("received");

    //Chats
    const {stompClient, connectWebSocket} = useWebSocket();
    const {chats, getChats} = useChat()

    const percentToDP = useWindowDimension("shorter");
    const heighPercentToDP = useWindowDimension("height");
    const colorScheme = useColorScheme();
    // @ts-ignore
    const themeColors = ThemeColors[colorScheme];


    useEffect(() => {
        refreshRequests(); // Load requests when the screen is mounted
    }, [currentTab]);

    useEffect(() => {
        if (userId && authToken) {
            getChats()
        }
    }, [userId, authToken]);

    // Connect to WebSocket whenever the chat list changes
    useEffect(() => {
        console.log("[SOCIALS] connecting to websocket - checking chats")
        if (chats.length > 0 && authToken) {
            if (stompClient) {
                console.log("[SOCIALS] deactivate websocket")
                stompClient.deactivate().then(r => connectWebSocket());
            } else {
                console.log("[SOCIALS] connecting to websocket")
                connectWebSocket();
                console.log("[SOCIALS] connection call ended")
            }
        }
    }, [chats]);

    // Clean up WebSocket connection on component unmount
    useEffect(() => {
        return () => {
            if (stompClient) {
                console.log("[SOCIALS] deactivate websocket")
                stompClient.deactivate();
            }
        };
    }, [stompClient]);

    const renderRequestsTab = () => (
        <ThemedView backgroundColor={themeColors.tertiary} style={{
            flex: 1,
            paddingVertical: widthPercentageToDP(6),
            paddingHorizontal: widthPercentageToDP(4),
        }}>
            <View style={{
                flex: 1,
            }}>
                <ThemedText textStyleOptions={{size: "veryBig", weight: 'bold'}} backgroundColorName={"transparent"}>
                    Received Requests
                </ThemedText>
                <FlatList
                    data={receivedRequests}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <FriendRequestListItem
                            requestId={item.id}
                            username={item.senderUsername}
                            senderId={item.senderId}
                            receiverId={item.receiverId}
                            avatar={item.senderId}
                            receiverImageUrl={item.receiverImageUrl}
                            senderImageUrl={item.senderImageUrl}
                            isReceiver={true}
                        />
                    )}
                    contentContainerStyle={{
                        paddingVertical: widthPercentageToDP(5),

                    }}
                />
            </View>
            <View style={{
                flex: 1,
                marginTop: heighPercentToDP(2),
            }}>
                <ThemedText textStyleOptions={{size: "veryBig", weight: 'bold'}} backgroundColorName={"transparent"}>Sent
                    Requests</ThemedText>
                <FlatList
                    data={sentRequests}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <FriendRequestListItem
                            requestId={item.id}
                            username={item.senderUsername}
                            senderId={item.senderId}
                            receiverId={item.receiverId}
                            avatar={item.senderId}
                            receiverImageUrl={item.receiverImageUrl}
                            senderImageUrl={item.senderImageUrl}
                            isReceiver={false}
                        />
                    )}
                    contentContainerStyle={{
                        paddingVertical: widthPercentageToDP(5),

                    }}
                />
            </View>

        </ThemedView>
    )


    const renderMessagesTab = () => (
        <ThemedView
            backgroundColor={themeColors.tertiary}
            style={{
                flex: 1,
                paddingVertical: widthPercentageToDP(2),
                paddingHorizontal: widthPercentageToDP(5),
            }}
        >
            <FlatList
                data={chats}
                keyExtractor={(item) => item.chatroomId.toString()}
                renderItem={({item}) => (
                    <ChatItem chatroomId={item.chatroomId} participants={item.participants}/>
                )}
            />
        </ThemedView>
    )


    const renderFriendsTab = () => (
        <ThemedView
            backgroundColor={themeColors.tertiary}
            style={{
                flex: 1,
                paddingVertical: widthPercentageToDP(2),
                paddingHorizontal: widthPercentageToDP(5),
            }}
        >
            <FlatList
                data={friends} // Use friends from FriendshipContext
                keyExtractor={(item) => item.id} // Ensure each friend has a unique ID
                renderItem={({item}) => (
                    <FriendListItem
                        username={item.username}
                        description={item.description}
                        userId={item.id}
                        imageUrl={item.imageUrl}
                    />
                )}
                contentContainerStyle={{}}
                ListEmptyComponent={
                    <ThemedText
                        style={{
                            textAlign: "center",
                            marginTop: widthPercentageToDP(5),
                            color: themeColors.textOnSecondary,
                        }}
                    >
                        You have no friends yet.
                    </ThemedText>
                }
            />
        </ThemedView>
    );

    const baseLabelStyle = useTextStyle({
        size: "medium",
        weight: "regular",
        font: "default",
    });


    const additionalStyle = {
        backgroundColor: themeColors.transparent,

    }
    const combinedStyle = {...baseLabelStyle, ...additionalStyle}
    const themePrimaryColor = useThemeColor("tertiary");
    const themeInactiveColor = useThemeColor("textOnSecondary");

    // Dynamic function to style each label
    const getLabelStyle = (isActive: boolean) => ({
        ...combinedStyle,
        color: isActive ? themePrimaryColor : themeInactiveColor,
    });


    // @ts-ignore
    return (
        <SafeAreaView style={{
            backgroundColor: themeColors.tertiary,
            height: heighPercentToDP(100),
            width: widthPercentageToDP(100),
        }}>
            <AppHeader backgroundColorName={"secondary"}/>
            <SegmentedControl
                segments={[
                    {
                        label: (
                            <ThemedText style={getLabelStyle(currentTab === 0)}>
                                Messages
                            </ThemedText>
                        ),
                    },
                    {
                        label: (
                            <ThemedText style={getLabelStyle(currentTab === 1)}>
                                Requests
                            </ThemedText>
                        ),
                    },
                    {
                        label: (
                            <ThemedText style={getLabelStyle(currentTab === 2)}>
                                Friends
                            </ThemedText>
                        ),
                    },
                ]}
                selectedIndex={currentTab}
                onChangeIndex={(index) => setCurrentTab(index)}

                activeColor={themeColors.primary}
                inactiveColor={themeColors.textOnSecondary}
                borderRadius={percentToDP(4)}
                backgroundColor={themeColors.transparent}
                activeBackgroundColor={themeColors.primary} // Transparent background for active segment
                inactiveBackgroundColor={"transparent"} // Transparent background for inactive segments
                outlineWidth={0}
                style={{
                    marginTop: widthPercentageToDP(5),
                    marginBottom: widthPercentageToDP(2),
                    width: widthPercentageToDP(50),
                    backgroundColor: themeColors.primary,
                    borderColor: themeColors.primary,
                    borderWidth: 0,
                    alignSelf: "center",
                }}
                segmentsStyle={{}}
            />

            {/* Tab Content */}
            {currentTab === 0 && renderMessagesTab()}
            {currentTab === 1 && renderRequestsTab()}
            {currentTab === 2 && renderFriendsTab()}

        </SafeAreaView>
    );
}