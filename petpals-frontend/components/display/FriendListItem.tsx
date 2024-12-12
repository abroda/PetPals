import {Alert, Pressable, StyleSheet} from "react-native";

import {ThemedView} from "@/components/basic/containers/ThemedView";

import {Avatar, View, Text} from "react-native-ui-lib";
import React, {useState} from "react";
import {Link, router} from "expo-router";
import {ThemedText} from "../basic/ThemedText";
import {widthPercentageToDP} from "react-native-responsive-screen";
import UserAvatar from "@/components/navigation/UserAvatar";
import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {ThemeColors} from "@/constants/theme/Colors";
import {useWindowDimension} from "@/hooks/theme/useWindowDimension";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";
import {ThemedButton} from "@/components/inputs/ThemedButton";
import {useFriendship} from "@/context/FriendshipContext";
import {useAuth} from "@/hooks/useAuth";

export default function FriendListItem(props: {
    username: any,
    description: any,
    userId: any,
    imageUrl?: string,
}) {

    const percentToDP = useWindowDimension("shorter");
    const heighPercentToDP = useWindowDimension("height");
    const colorScheme = useColorScheme();
    // @ts-ignore
    const themeColors = ThemeColors[colorScheme];
    const {removeFriend} = useFriendship();
    const {userId} = useAuth()

    const handleRemoveFriend = async () => {
        if (userId) {
            const success = await removeFriend(userId, props.userId);
            if (success) {
                Alert.alert(
                    "Friend Request",
                    `You removed ${props.username} from your friends list.`
                );
            } else {
                Alert.alert("Error", "Failed to remove the friend.");
            }
        } else {
            Alert.alert("Error", "You are not logged in.");
        }

    };

    return (
        <Pressable
            onPress={() =>
                router.push(
                    `/user/${props.userId}`
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
                <UserAvatar size={15} userId={props.userId} imageUrl={props.imageUrl} doLink={true}/>

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
                        {props.username}
                    </ThemedText>

                    {/* Description */}
                    <ThemedText
                        style={{
                            fontSize: widthPercentageToDP(3.5),
                            lineHeight: widthPercentageToDP(3.5),
                            width: percentToDP(55),
                        }}
                        textColorName="textOnSecondary"
                        backgroundColorName={"secondary"}
                    >
                        {props.description || "No description available"}
                    </ThemedText>
                </View>

                <ThemedButton
                    textColorName={"accent"}
                    onPress={handleRemoveFriend}
                    shape={"round"}
                    border={true}
                    backgroundColorName={"transparent"}
                    style={{height: percentToDP(10), width: percentToDP(10)}}
                    iconSource={() => <ThemedIcon size={20} name={"close"}
                                                  colorName={"accent"}></ThemedIcon>}
                />
            </View>
        </Pressable>

    )
};