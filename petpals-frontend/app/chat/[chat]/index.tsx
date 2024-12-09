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

    // Fetch messages when the component loads
    useEffect(() => {
        console.log("CHECKING CHATID and TOKEN: " + chatroomId + authToken)
        if (!chatroomId || !authToken) return;
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
                                    flexDirection: 'row',
                                    marginVertical: 5,
                                    paddingHorizontal: 10
                                }, item.sender.id === userId ? {
                                    justifyContent: 'flex-end',
                                    alignSelf: 'flex-end'
                                } : {
                                    justifyContent: 'flex-start',
                                    alignSelf: 'flex-start'
                                }]}>
                                <ThemedView style={[{
                                    maxWidth: '70%',
                                    padding: 10,
                                    borderRadius: 15,
                                }, item.sender.id === userId ? {
                                    backgroundColor: tertiaryColor,
                                    borderBottomEndRadius: 5
                                } : {backgroundColor: primaryColor, borderBottomStartRadius: 5}]}>
                                    <ThemedText backgroundColorName={"transparent"}
                                                style={[item.sender.id === userId ? {
                                                    color: "#fff",
                                                    textAlign: "right"
                                                } : {color: tertiaryColor}, {fontSize: 16}]}>{item.sender.username}</ThemedText>
                                    <ThemedText backgroundColorName={"transparent"}
                                                style={[item.sender.id === userId ? {
                                                    color: "#fff",
                                                    textAlign: "right"
                                                } : {color: tertiaryColor}, {fontSize: 20}]}>{item.content}</ThemedText>
                                    <ThemedText
                                        backgroundColorName={"transparent"} style={[item.sender.id === userId ? {
                                        color: "#fff",
                                        textAlign: "right"
                                    } : {color: tertiaryColor}, {fontSize: 12}]}>{new Date(item.sendAt).toLocaleTimeString()}</ThemedText>
                                </ThemedView>
                            </ThemedView>
                        )
                    }
                    inverted // Show the latest messages at the bottom
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={() =>
                        isLoading ? <ThemedText backgroundColorName={"transparent"}>Loading...</ThemedText> : null}
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
                <ThemedButton onPress={() => console.log("send message")} shape={"round"}
                              style={{width: percentToDP(16), height: percentToDP(16)}}
                              iconSource={() => <ThemedIcon size={30} name={"send"}
                                                            colorName={"textOnPrimary"}></ThemedIcon>}
                />
            </HorizontalView>
        </SafeAreaView>
    );
}
