import React, { useState } from "react";
import { Pressable, StyleSheet, Alert } from "react-native";
import { Avatar, View, Text } from "react-native-ui-lib";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedText } from "../basic/ThemedText";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { useFriendship } from "@/context/FriendshipContext";
import { useRouter } from "expo-router";

import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {ThemeColors} from "@/constants/theme/Colors";
import UserAvatar from "@/components/navigation/UserAvatar";

export default function FriendRequestListItem(props: {
  requestId: string;
  username: string;
  senderId: string;
  receiverId: string;
  avatar?: string;
}) {
  const { acceptFriendRequest, denyFriendRequest } = useFriendship();
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
      Alert.alert("Friend Request", `You denied the request from ${props.username}.`);
    } else {
      Alert.alert("Error", "Failed to deny the friend request.");
    }
  };

  return (
    <ThemedView
      style={{
        flexDirection: "row",
        flex: 1,
        // height: percentToDP(45),
        marginVertical: percentToDP(1),
        padding: percentToDP(4),
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: themeColors.tertiary,
        borderRadius: percentToDP(4),
      }}
    >
      {/* Avatar and username */}
      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

      }}>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          marginHorizontal: 'auto',
          alignItems: 'center',
          alignContent: 'space-between',
          justifyContent: 'space-between'
        }}>
          <Pressable onPress={() => router.push(`/user/${props.senderId}`)}>
            <UserAvatar
              size={percentToDP(5)}
              userId={props.avatar}
              doLink={true}
            />
          </Pressable>
          {props.username? <ThemedText
            textColorName={"textOnSecondary"}
            style={{
              flex: 1,
              fontSize: percentToDP(5),
              marginLeft: percentToDP(4),
              lineHeight: percentToDP(5),
            }}
            textStyleOptions={{
              size: "big",
              weight: "bold"
            }}
          >
            {props.username}
          </ThemedText> : <ThemedText>Unknown User</ThemedText>}
        </View>



        {/* Accept and Deny Buttons */}
        <View style={{
          flexDirection: "row",
          alignContent: 'space-around',
          justifyContent: 'space-around',
          marginTop: percentToDP(2),
        }}>
          <ThemedButton
            label="Accept"
            onPress={handleAccept}
            textColorName={"primary"}
            style={{
              backgroundColor: themeColors.transparent,
              flex: 1,
              padding: percentToDP(0),
              marginRight: percentToDP(4),
              borderWidth: 2,
              borderRadius: percentToDP(4),
              borderColor: themeColors.primary,
            }}
          />
          <ThemedButton
            label="Deny"
            textColorName={"accent"}
            onPress={handleDeny}
            style={{
              backgroundColor: themeColors.transparent,
              flex: 1,
              padding: percentToDP(0),
              borderWidth: 2,
              borderRadius: percentToDP(4),
              borderColor: themeColors.accent,
            }}
          />
        </View>

      </View>



    </ThemedView>
  );
}
