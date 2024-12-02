import { Pressable, StyleSheet } from "react-native";

import { ThemedView } from "@/components/basic/containers/ThemedView";

import { Avatar, View, Text } from "react-native-ui-lib";
import { useState } from "react";
import { Link, router } from "expo-router";
import { ThemedText } from "../basic/ThemedText";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import {widthPercentageToDP} from "react-native-responsive-screen";
import UserAvatar from "@/components/navigation/UserAvatar";
import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {ThemeColors} from "@/constants/theme/Colors";

export default function FriendListItem (props:{
  username: any,
  description: any,
  userId: any })
{

  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];

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
          padding: widthPercentageToDP(4),
          marginBottom: widthPercentageToDP(2),
          borderRadius: widthPercentageToDP(2),
          backgroundColor: themeColors.tertiary,
        }}
      >
        <UserAvatar size={20} userId={props.userId} doLink={true}/>
        <View style={{marginLeft: widthPercentageToDP(4)}}>
          <ThemedText
            style={{fontSize: widthPercentageToDP(4), fontWeight: "bold"}}
            textColorName="textOnSecondary"
          >
            {props.username}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: widthPercentageToDP(3.5),
              width: widthPercentageToDP(60),
            }}
            textColorName="textOnSecondary"
          >
            {props.description || "No description available"}
          </ThemedText>
        </View>
      </View>
    </Pressable>

  )};