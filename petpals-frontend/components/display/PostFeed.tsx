import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "expo-router";
import { ReactElement, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import Post from "./Post";
import { Dimensions, FlatListProps } from "react-native";
import { ThemedScrollView } from "../basic/containers/ThemedScrollView";
import { useWindowDimension } from "@/hooks/useWindowDimension";

export default function PostFeed(props: { username: string }) {
  const postsData = [0, 1, 2, 3];
  const percentToDP = useWindowDimension("height");
  /*
    TODO PostFeed: pull posts from context, refreshing, comment/reaction icons,
    reaction dialog, layout
  */
  return (
    <FlatList
      style={{
        height: percentToDP(76),
        marginBottom: percentToDP(6),
      }}
      data={postsData}
      renderItem={(item) => <Post username={props.username} />}
    />
  );
}
