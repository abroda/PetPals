import React, {useEffect, useState} from "react";
import {Pressable, StyleSheet, Alert} from "react-native";
import {Avatar, View, Text} from "react-native-ui-lib";
import {ThemedView} from "@/components/basic/containers/ThemedView";
import {ThemedText} from "../basic/ThemedText";
import {ThemedButton} from "@/components/inputs/ThemedButton";
import {useWindowDimension} from "@/hooks/theme/useWindowDimension";
import {useFriendship} from "@/context/FriendshipContext";
import {useRouter} from "expo-router";

import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {ThemeColors} from "@/constants/theme/Colors";
import UserAvatar from "@/components/navigation/UserAvatar";
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";

export default function FriendRequestListItem(props: {
    requestId: string;
    isReceiver?: boolean;
    username: string;
    senderId: string;
    receiverId: string;
    avatar?: string;
    receiverImageUrl: string;
    senderImageUrl: string;
}) {


    const {acceptFriendRequest, denyFriendRequest, removePendingFriendRequest} = useFriendship();
    const router = useRouter();
    const percentToDP = useWindowDimension("shorter");

    // Colours
    const colorScheme = useColorScheme();
    // @ts-ignore
    const themeColors = ThemeColors[colorScheme];

    const handleAccept = async () => {
        const success = await acceptFriendRequest(props.requestId);
        if (success) {
            Alert.alert("Friend Request", `${props.username} is now your friend!`);
        } else {
            Alert.alert("Error", "Failed to accept the friend request.");
        }
    };

    const handleDeny = async () => {
        const success = await denyFriendRequest(props.requestId);
        if (success) {
            Alert.alert(
                "Friend Request",
                `You denied the request from ${props.username}.`
            );
        } else {
            Alert.alert("Error", "Failed to deny the friend request.");
        }
    };

    const handleCancelRequest = async () => {
        const success = await removePendingFriendRequest(props.requestId);
        if (success) {
            Alert.alert("Friend Request", "Your request has been canceled.");
        } else {
            Alert.alert("Error", "Failed to cancel the friend request.");
        }
    };

    useEffect(() => {
        console.log(props)
    }, []);

    return (
        <ThemedView
            style={{
                flexDirection: "row",
                flex: 1,
                marginVertical: heightPercentageToDP(0.5),
                // marginHorizontal: widthPercentageToDP(5),
                backgroundColor: themeColors.secondary,
                borderRadius: percentToDP(4),
                padding: percentToDP(1)

            }}
        >
            <Pressable onPress={() => router.push(`/user/${props.senderId}`)} style={{marginRight: 5}}>
                <UserAvatar size={percentToDP(3)} userId={props.avatar} imageUrl={props.isReceiver ? props.senderImageUrl : props.receiverImageUrl} doLink={true}/>
            </Pressable>

            <ThemedView colorName={"transparent"} style={{padding: percentToDP(1)}}>
                {props.username ? (
                    <ThemedText
                        textColorName={"textOnSecondary"}
                        backgroundColorName={"transparent"}
                        style={{
                            fontSize: percentToDP(4),
                            lineHeight: percentToDP(4),
                        }}
                        textStyleOptions={{
                            size: "big",
                            weight: "bold",
                        }}
                    >
                        {props.username}
                    </ThemedText>
                ) : (
                    <ThemedText style={{
                        fontSize: percentToDP(4),
                        lineHeight: percentToDP(4),
                    }} backgroundColorName={"transparent"}
                    >
                        Unknown User
                    </ThemedText>
                )}
                <ThemedText
                    textColorName={"textOnSecondary"}
                    backgroundColorName={"transparent"}
                    style={{
                        textAlign: "center",
                        textAlignVertical: 'center',
                        // flex: 1,
                    }}
                >
                    Awaiting answer
                </ThemedText>
            </ThemedView>


            {props.isReceiver ? (
                <View
                    style={{
                        flex: 2,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        padding: percentToDP(1),
                        gap: percentToDP(1),
                    }}
                >
                    <ThemedButton
                        textColorName={"primary"}
                        onPress={handleAccept}
                        shape={"round"}
                        border={true}
                        backgroundColorName={"transparent"}
                        style={{height: percentToDP(10), width: percentToDP(10)}}
                        iconSource={() => <ThemedIcon size={20} name={"checkmark"}
                                                      colorName={"primary"}></ThemedIcon>}
                    />
                    <ThemedButton
                        textColorName={"accent"}
                        onPress={handleDeny}
                        shape={"round"}
                        border={true}
                        backgroundColorName={"transparent"}
                        style={{height: percentToDP(10), width: percentToDP(10)}}
                        iconSource={() => <ThemedIcon size={20} name={"close"}
                                                      colorName={"accent"}></ThemedIcon>}
                    />
                </View>
            ) : (

                <View style={{
                    flex: 2,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    padding: percentToDP(1),
                    gap: percentToDP(1),
                }}>
                    <ThemedButton
                        textColorName={"accent"}
                        onPress={handleCancelRequest}
                        shape={"round"}
                        border={true}
                        backgroundColorName={"transparent"}
                        style={{height: percentToDP(10), width: percentToDP(10)}}
                        iconSource={() => <ThemedIcon size={20} name={"close"}
                                                      colorName={"accent"}></ThemedIcon>}
                    />
                </View>

            )}
        </ThemedView>
    );
}
