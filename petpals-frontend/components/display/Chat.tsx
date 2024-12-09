import {ThemedView} from "@/components/basic/containers/ThemedView";
import {Href, router} from "expo-router";
import {ThemedText} from "@/components/basic/ThemedText";
import {StyleSheet, TouchableOpacity} from "react-native";
import {ChatroomResponse, useChat} from "@/context/ChatContext";
import UserAvatar from "@/components/navigation/UserAvatar";
import {useWindowDimension} from "@/hooks/theme/useWindowDimension";
import {useAuth} from "@/hooks/useAuth";

export default function ChatItem(props: ChatroomResponse) {
    const percentToDP = useWindowDimension("shorter");
    const heightPercentToDP = useWindowDimension("height");
    const {userId} = useAuth()
    const {latestMessages} = useChat()

    return <ThemedView>
        <TouchableOpacity
            style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                margin: percentToDP(3)
            }}
            onPress={() =>
                router.push(`/chat/${props.chatroomId}` as Href<string>)
            }
        >
            <ThemedView style={{marginRight: percentToDP(3)}}>
                <UserAvatar doLink={false} size={15} userId={props.participants[0].id}></UserAvatar>
            </ThemedView>
            <ThemedView>
                <ThemedText
                    numberOfLines={1}>{props.participants.filter((participant) => participant.id !== userId).map((participant) => participant.username)[0]}</ThemedText>
                <ThemedView style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: percentToDP(68),
                    gap: percentToDP(5)
                }}>
                    <ThemedText style={{width: percentToDP(50)}}
                                numberOfLines={1}>{latestMessages[props.chatroomId]?.sender.username + ': ' + latestMessages[props.chatroomId]?.content || 'No messages yet'}</ThemedText>
                    <ThemedText
                        style={{fontSize: 12}}>{latestMessages[props.chatroomId]?.sendAt ? new Date(latestMessages[props.chatroomId]?.sendAt).toLocaleTimeString() : ''}</ThemedText>
                </ThemedView>
            </ThemedView>
        </TouchableOpacity>
    </ThemedView>
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

