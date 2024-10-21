import { Pressable, StyleSheet } from "react-native";

import { ThemedView } from "@/components/basic/containers/ThemedView";

import { Avatar, View, Text } from "react-native-ui-lib";
import { useState } from "react";
import { Link, router } from "expo-router";
import { ThemedText } from "../basic/ThemedText";

export default function FriendRequestListItem(props: { username: string }) {
  const [selected, setSelected] = useState("");

  return (
    <ThemedView style={styles.topBar}>
      <Pressable onPress={() => router.push(`/user/${props.username}`)}>
        <Avatar
          source={{
            uri: "https://external-preview.redd.it/PzM9Myb5uugh3qrxvb1F0nVTsdXJKRl0NB88MuAPwZA.jpg?auto=webp&s=6627165dbd61ab8a8d7fc026b5ce9199c593fe93",
          }}
        />
      </Pressable>
      <ThemedView style={{ justifyContent: "center" }}>
        <ThemedText
          style={{ paddingHorizontal: 20, fontSize: 30 }}
          textStyleName="bigBold"
          textColorName="link"
        >
          {props.username}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    width: "100%",
    margin: 10,
    justifyContent: "flex-start",
  },
  accountName: {
    paddingHorizontal: 20,
  },
});
