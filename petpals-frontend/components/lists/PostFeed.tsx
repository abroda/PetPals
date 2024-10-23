import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "expo-router";
import { ReactElement, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import Post from "../display/Post";
import { Dimensions, FlatListProps } from "react-native";
import { ThemedScrollView } from "../basic/containers/ThemedScrollView";

export default function PostFeed() {
  const postsData = [0, 1, 2, 3];
  /*
    TODO PostFeed: pull posts from context, refreshing, comment/reaction icons,
    reaction dialog, layout
  */
  return (
    <ThemedView colorName="secondary">
      <FlatList
        style={{
          height: Dimensions.get("window").height * 0.85,
          paddingBottom: 35,
        }}
        data={postsData}
        renderItem={(item) => <Post />}
      />
    </ThemedView>
  );
}
