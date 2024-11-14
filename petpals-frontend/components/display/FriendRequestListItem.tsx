import { Pressable, StyleSheet } from "react-native";

import { ThemedView } from "@/components/basic/containers/ThemedView";

import { Avatar, View, Text } from "react-native-ui-lib";
import { useState } from "react";
import { Link, router } from "expo-router";
import { ThemedText } from "../basic/ThemedText";
import { useWindowDimension } from "@/hooks/useWindowDimension";

export default function FriendRequestListItem(props: { username: string }) {
  const [selected, setSelected] = useState("");
  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");

  return (
    <ThemedView
      style={{
        flexDirection: "row",
        width: percentToDP(100),
        margin: percentToDP(4),
        justifyContent: "flex-start",
      }}
    >
      <Pressable onPress={() => router.push(`/user/${props.username}`)}>
        <Avatar
          source={{
            uri: "https://external-preview.redd.it/PzM9Myb5uugh3qrxvb1F0nVTsdXJKRl0NB88MuAPwZA.jpg?auto=webp&s=6627165dbd61ab8a8d7fc026b5ce9199c593fe93",
          }}
        />
      </Pressable>
      <ThemedView style={{ justifyContent: "center" }}>
        <ThemedText
          style={{
            paddingHorizontal: percentToDP(2),
            fontSize: percentToDP(8),
          }}
          textStyleOptions={{ size: "big", weight: "bold" }}
          textColorName="link"
        >
          {props.username}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
