import React, { useState } from "react";
import { Pressable, StyleSheet, Alert } from "react-native";
import { Avatar, View, Text } from "react-native-ui-lib";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedText } from "../basic/ThemedText";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { useFriendship } from "@/context/FriendshipContext";
import { useRouter } from "expo-router";

import { useColorScheme } from "@/hooks/theme/useColorScheme";
import { ThemeColors } from "@/constants/theme/Colors";
import UserAvatar from "@/components/navigation/UserAvatar";
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";

export default function FriendRequestListItem(props: {
  requestId: string;
  isReceiver?: boolean;
  username: string;
  senderId: string;
  receiverId: string;
  avatar?: string;
}) {


  const { acceptFriendRequest, denyFriendRequest, removePendingFriendRequest } = useFriendship();
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

  return (
    <ThemedView
      style={{
        flexDirection: "row",
        flex: 1,
        marginVertical: heightPercentageToDP(1),
        // marginHorizontal: widthPercentageToDP(5),
        backgroundColor: themeColors.tertiary,
        borderRadius: percentToDP(4),

      }}
    >
      {/* Whole card */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          paddingHorizontal: widthPercentageToDP(4),
          paddingVertical: widthPercentageToDP(4),
          // backgroundColor: 'blue',
        }}
      >
        {/* Avatar and username */}
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: 'center',
            width: percentToDP(30),
          }}
        >
          <Pressable onPress={() => router.push(`/user/${props.senderId}`)}>
            <UserAvatar size={percentToDP(6)} userId={props.avatar} doLink={true} />
          </Pressable>

          {props.username ? (
            <ThemedText
              textColorName={"textOnSecondary"}
              style={{
                fontSize: percentToDP(4),
                lineHeight: percentToDP(5),
                marginTop: percentToDP(3),
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
              lineHeight: percentToDP(5),
              marginTop: percentToDP(3),
            }}>
              Unknown User
            </ThemedText>
          )}
        </View>


        {/* Accept and Deny Buttons OR Awaiting Answer */}
        {props.isReceiver ? (
          <View
            style={{
              flex: 2,
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
              alignItems: 'center',
              margin: 'auto',

            }}
          >
            <ThemedButton
              label="Accept"
              onPress={handleAccept}
              textColorName={"primary"}
              shape={"half"}
              border={true}
              backgroundColorName={"transparent"}
              style={{
                marginBottom: widthPercentageToDP(2),
              }}
            />
            <ThemedButton
              label="Deny"
              textColorName={"accent"}
              onPress={handleDeny}
              shape={"half"}
              border={true}
              backgroundColorName={"transparent"}
            />
          </View>
        ) : (

          <View style={{
            flex: 2,
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
            alignItems: 'center',
            margin: 'auto',

          }}>
            <ThemedText
              textColorName={"textOnSecondary"}
              style={{
                textAlign: "center",
                textAlignVertical: 'center',
                flex: 1,
              }}
            >
              Awaiting answer
            </ThemedText>

            <ThemedButton
              label="Cancel request"
              textColorName={"accent"}
              onPress={handleCancelRequest}
              shape={"half"}
              border={true}
              backgroundColorName={"transparent"}
            />
          </View>

        )}
      </View>
    </ThemedView>
  );
}
