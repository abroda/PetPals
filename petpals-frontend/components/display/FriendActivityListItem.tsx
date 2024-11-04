import { Pressable } from "react-native";

import { ThemedView } from "@/components/basic/containers/ThemedView";

import { useState } from "react";
import { router } from "expo-router";
import { ThemedText } from "../basic/ThemedText";
import HorizontalView from "../basic/containers/HorizontalView";
import UserAvatar from "../navigation/UserAvatar";
import { useWindowDimension } from "@/hooks/useWindowDimension";

export default function FriendActivityListItem(props: { username: string }) {
  const [selected, setSelected] = useState("");
  const percentToPD = useWindowDimension("shorter");

  return (
    <Pressable onPress={() => router.push(`/user/${props.username}`)}>
      <HorizontalView justifyOption="flex-start">
        <UserAvatar
          size={13}
          userId={props.username}
          doLink={true}
        />
        <ThemedView style={{ justifyContent: "center" }}>
          <ThemedText
            style={{ paddingHorizontal: percentToPD(8) }}
            textStyleOptions={{ size: "big", weight: "bold" }}
          >
            {props.username}
          </ThemedText>
          <ThemedText
            style={{ paddingHorizontal: percentToPD(8) }}
            textStyleOptions={{ size: "small" }}
          >
            {props.username}
          </ThemedText>
        </ThemedView>
      </HorizontalView>
    </Pressable>
  );
}
