import { Pressable, StyleSheet } from "react-native";

import { ThemedView } from "@/components/basic/containers/ThemedView";

import { Avatar, View, Text } from "react-native-ui-lib";
import { useState } from "react";
import { Link, router } from "expo-router";
import { ThemedText } from "../basic/ThemedText";
import {widthPercentageToDP} from "react-native-responsive-screen";
import UserAvatar from "@/components/navigation/UserAvatar";
import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {ThemeColors} from "@/constants/theme/Colors";
import {useWindowDimension} from "@/hooks/theme/useWindowDimension";

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
          padding: widthPercentageToDP(2),
          marginBottom: widthPercentageToDP(2),
          borderRadius: widthPercentageToDP(4),
          backgroundColor: themeColors.secondary,
        }}
      >
        {/* User avatar */}
        <UserAvatar size={15} userId={props.userId} doLink={true}/>

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
              width: percentToDP(60),
            }}
            textColorName="textOnSecondary"
            backgroundColorName={"secondary"}
          >
            {props.description || "No description available"}
          </ThemedText>
        </View>
      </View>
    </Pressable>

  )};