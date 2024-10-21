import { Pressable, StyleSheet } from "react-native";

import { ThemedView } from "@/components/basic/containers/ThemedView";

import { Avatar, View, Text } from "react-native-ui-lib";
import { useState } from "react";
import { Link, router } from "expo-router";
import { ThemedText } from "../basic/ThemedText";
import HorizontalView from "../basic/containers/HorizontalView";
import UserAvatar from "../navigation/UserAvatar";

export default function ChatListItem(props: { username: string }) {
  const [selected, setSelected] = useState("");

  return (
    <Pressable onPress={() => router.push(`/chat/${props.username}`)}>
      <HorizontalView justifyOption="flex-start">
        <UserAvatar
          size={50}
          username={props.username}
          doLink={false}
        />
        <ThemedView style={{ justifyContent: "center" }}>
          <ThemedText
            style={{ paddingHorizontal: 20 }}
            textStyleName="bigBold"
          >
            {props.username}
          </ThemedText>
          <ThemedText
            style={{ paddingHorizontal: 20 }}
            textStyleName="small"
          >
            {props.username}
          </ThemedText>
        </ThemedView>
      </HorizontalView>
    </Pressable>
  );
}
