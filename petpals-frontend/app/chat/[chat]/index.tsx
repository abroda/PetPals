import {ThemedText} from "@/components/basic/ThemedText";
import {useWindowDimension} from "@/hooks/theme/useWindowDimension";
import {usePathname} from "expo-router";
import {ThemedTextField} from "@/components/inputs/ThemedTextField";
import {ThemedView} from "@/components/basic/containers/ThemedView";
import {ThemedButton} from "@/components/inputs/ThemedButton";
import {FlatList, SafeAreaView, StyleSheet} from "react-native";
import {useChat} from "@/context/ChatContext";
import {useEffect, useState} from "react";
import {useAuth} from "@/hooks/useAuth";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";
import {useThemeColor} from "@/hooks/theme/useThemeColor";
import {useWebSocket} from "@/context/WebSocketContext";
import UserAvatar from "@/components/navigation/UserAvatar";

export default function ChatScreen() {
    const path = usePathname();
    const chatroomId = path.slice(path.lastIndexOf("/") + 1);
    const percentToDP = useWindowDimension("shorter");
    const heighPercentToDP = useWindowDimension("height");
    const [isLoading, setIsLoading] = useState(false);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const {chatMessages, setChatMessages, fetchMessages} = useChat();
    const {userId, authToken} = useAuth()
    const tertiaryColor = useThemeColor("tertiary");
    const primaryColor = useThemeColor("primary");
    const {sendMessage} = useWebSocket();

    // Fetch messages when the component loads
    useEffect(() => {
        console.log("CHECKING CHATID and TOKEN: " + chatroomId + " : " + path.slice(1, path.lastIndexOf("/")) + " : " + authToken)
        if (!chatroomId || path.slice(1, path.lastIndexOf("/")) !== "chat" || !authToken) return;
        if (page === 0) {
            // Initial load: Reset messages and fetch fresh data
            console.log("RESETTING MESSAGES FOR NEW CHATROOM");
            fetchMessages(hasMore, setHasMore, page, chatroomId, setIsLoading, true);
        } else {
            // Paginated fetch: Append messages
            console.log("FETCHING ADDITIONAL MESSAGES FOR CHATROOM");
            fetchMessages(hasMore, setHasMore, page, chatroomId, setIsLoading, false);
        }
    }, [chatroomId, authToken, page]);

    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <ThemedView style={{flex: 1, paddingTop: heighPercentToDP(12)}} colorName={"secondary"}>
                <FlatList
                    data={chatMessages[chatroomId]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) =>
                        (
                            <ThemedView
                                colorName={"transparent"}
                                style={[{
                                    marginVertical: 5,
                                    paddingHorizontal: 10,
                                    alignItems: "flex-end"
                                }, item.sender.id === userId ? {
                                    justifyContent: 'flex-end',
                                    alignSelf: 'flex-end',
                                    flexDirection: 'row-reverse',
                                } : {
                                    justifyContent: 'flex-start',
                                    alignSelf: 'flex-start',
                                    flexDirection: 'row',
                                }]}>
                                <UserAvatar size={10}
                                            userId={item.sender.id}
                                            imageUrl={item.sender.imageUrl}
                                            style={{ marginHorizontal: 5 }}
                                            doLink={true}/>
                                <ThemedView style={[{
                                    maxWidth: percentToDP(70),
                                    padding: percentToDP(2),
                                    borderRadius: 15,
                                }, item.sender.id === userId ? {
                                    backgroundColor: tertiaryColor,
                                    borderBottomEndRadius: 5
                                } : {backgroundColor: primaryColor, borderBottomStartRadius: 5}]}>
                                    <ThemedText backgroundColorName={"transparent"}
                                                style={[item.sender.id === userId ? {
                                                    color: "#fff",
                                                    // textAlign: "right"
                                                } : {color: tertiaryColor}, {fontSize: percentToDP(4)}]}>{item.sender.username}</ThemedText>
                                    <ThemedText backgroundColorName={"transparent"}
                                                style={[item.sender.id === userId ? {
                                                    color: "#fff",
                                                    // textAlign: "right"
                                                } : {color: tertiaryColor}, {fontSize: percentToDP(5)}]}>{item.content}</ThemedText>
                                    <ThemedText
                                        backgroundColorName={"transparent"} style={[item.sender.id === userId ? {
                                        color: "#fff",
                                        textAlign: "right"
                                    } : {color: tertiaryColor}, {fontSize: percentToDP(3)}]}>{new Date(item.sendAt).toLocaleTimeString()}</ThemedText>
                                </ThemedView>
                            </ThemedView>
                        )
                    }
                    inverted // Show the latest messages at the bottom
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.1}
                    // ListFooterComponent={() =>
                    //     isLoading ? <ThemedText backgroundColorName={"transparent"}>Loading...</ThemedText> : null}
                />
            </ThemedView>

            {/* Input Field */}
            <HorizontalView style={{paddingVertical: 20, paddingHorizontal: 10, alignContent: "center"}}>
                <ThemedTextField
                    placeholder="Type a message"
                    value={inputMessage}
                    onChangeText={setInputMessage}
                    width={75}
                />
                <ThemedButton onPress={() => sendMessage(chatroomId, inputMessage, setInputMessage)} shape={"round"}
                              style={{width: percentToDP(16), height: percentToDP(16)}}
                              iconSource={() => <ThemedIcon size={30} name={"send"}
                                                            colorName={"textOnPrimary"}></ThemedIcon>}
                />
            </HorizontalView>
        </SafeAreaView>
    );
}
