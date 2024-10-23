import { FlatList } from "react-native-gesture-handler";
import Post from "./Post";
import { FlatListProps, StyleProp, ViewStyle } from "react-native";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { ReactElement } from "react";

export type PostFeedProps = {
  style?: ViewStyle;
  username: string;
};

export default function PostFeed({ style, username }: PostFeedProps) {
  const postsData = [0, 1, 2, 3];
  const percentToDP = useWindowDimension("height");
  /*
    TODO PostFeed: pull posts from context, refreshing, comment/reaction icons,
    reaction dialog, layout
  */
  return (
    <FlatList
      style={[
        {
          height: style?.height ?? percentToDP(76),
          marginBottom: style?.marginBottom ?? percentToDP(6),
        },
        style,
      ]}
      data={postsData}
      renderItem={(item) => <Post />}
    />
  );
}
