import {ThemedView} from "@/components/basic/containers/ThemedView";
import {Href, router} from "expo-router";
import {ThemedText} from "@/components/basic/ThemedText";
import {Pressable, StyleSheet, TouchableOpacity} from "react-native";
import {ChatroomResponse, useChat} from "@/context/ChatContext";
import UserAvatar from "@/components/navigation/UserAvatar";
import {useWindowDimension} from "@/hooks/theme/useWindowDimension";
import {useAuth} from "@/hooks/useAuth";
import {View} from "react-native-ui-lib";
import {widthPercentageToDP} from "react-native-responsive-screen";
import {ThemeColors} from "@/constants/theme/Colors";
import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {useEffect} from "react";

export default function ChatItem(props: ChatroomResponse) {
    const percentToDP = useWindowDimension("shorter");
    const heightPercentToDP = useWindowDimension("height");
    const {userId} = useAuth()
    const {latestMessages} = useChat()
    const colorScheme = useColorScheme();
    const themeColors = ThemeColors[colorScheme];
    useEffect(() => {
        console.log("LAST MESSAGE: ", latestMessages)
    }, []);

    return (
        <Pressable
            onPress={() =>
                router.push(
                    `/chat/${props.chatroomId}`
                )
            }
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: widthPercentageToDP(2),
                    marginBottom: widthPercentageToDP(2),
                    borderRadius: widthPercentageToDP(4),
                    backgroundColor: themeColors.secondary,
                }}
            >
                {/* User avatar */}
                <UserAvatar size={15}
                            userId={props.participants.filter((participant) => participant.id !== userId).map((participant) => participant.id)[0]}
                            imageUrl={props.participants.filter((participant) => participant.id !== userId).map((participant) => participant.imageUrl)[0]}
                            doLink={true}/>

                <View style={{
                    marginHorizontal: 'auto',
                }}>

                    {/* Username */}
                    <ThemedText
                        style={{
                            fontSize: widthPercentageToDP(4.5),
                            lineHeight: widthPercentageToDP(4.5),
                            fontWeight: "bold",
                            marginVertical: widthPercentageToDP(2)
                        }}
                        textColorName="textOnSecondary"
                        backgroundColorName={"secondary"}
                    >
                        {props.participants.filter((participant) => participant.id !== userId).map((participant) => participant.username)[0]}
                    </ThemedText>
                    <ThemedView style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: percentToDP(68),
                        gap: percentToDP(5),
                    }}
                                colorName={"transparent"}>
                        <ThemedText style={{
                            width: percentToDP(50),
                            fontSize: widthPercentageToDP(3.5),
                            lineHeight: widthPercentageToDP(3.5)
                        }}
                                    numberOfLines={1}
                                    backgroundColorName={"transparent"}>{latestMessages[props.chatroomId] != null ? (latestMessages[props.chatroomId]?.sender.username + ': ' + latestMessages[props.chatroomId]?.content) : 'No messages yet'}</ThemedText>
                        <ThemedText
                            style={{fontSize: widthPercentageToDP(2.5), lineHeight: widthPercentageToDP(3.5)}}
                            backgroundColorName={"transparent"}>{latestMessages[props.chatroomId]?.sendAt ? new Date(latestMessages[props.chatroomId]?.sendAt).toLocaleTimeString() : ''}</ThemedText>
                    </ThemedView>
                </View>
            </View>
        </Pressable>
        // <ThemedView>
        //     <TouchableOpacity
        //         style={{
        //             flex: 1,
        //             flexDirection: "row",
        //             alignItems: "center",
        //             margin: percentToDP(3)
        //         }}
        //         onPress={() =>
        //             router.push(`/chat/${props.chatroomId}` as Href<string>)
        //         }
        //     >
        //         <ThemedView style={{marginRight: percentToDP(3)}}>
        //             <UserAvatar doLink={false} size={15} userId={props.participants[0].id}></UserAvatar>
        //         </ThemedView>
        //         <ThemedView>
        //             <ThemedText
        //                 numberOfLines={1}>{props.participants.filter((participant) => participant.id !== userId).map((participant) => participant.username)[0]}</ThemedText>
        //             <ThemedView style={{
        //                 flex: 1,
        //                 flexDirection: "row",
        //                 alignItems: "center",
        //                 justifyContent: "space-between",
        //                 width: percentToDP(68),
        //                 gap: percentToDP(5)
        //             }}>
        //                 <ThemedText style={{width: percentToDP(50)}}
        //                             numberOfLines={1}>{latestMessages[props.chatroomId]?.sender.username + ': ' + latestMessages[props.chatroomId]?.content || 'No messages yet'}</ThemedText>
        //                 <ThemedText
        //                     style={{fontSize: 12}}>{latestMessages[props.chatroomId]?.sendAt ? new Date(latestMessages[props.chatroomId]?.sendAt).toLocaleTimeString() : ''}</ThemedText>
        //             </ThemedView>
        //         </ThemedView>
        //     </TouchableOpacity>
        // </ThemedView>
    )
}

const styles = StyleSheet.create({
    chatDetails: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        margin: 10
    },
    chatAvatar: {
        paddingRight: 10
    },
    chatMessage: {
        // width: '100%'
    },
    chatMessageContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
});

