import {
  ThemedView,
  ThemedViewProps,
} from "@/components/basic/containers/ThemedView";
import { FlatList } from "react-native-gesture-handler";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import Post from "@/components/display/Post";
import { FlatListProps, ViewStyle } from "react-native";

export type PostFeedProps = {
  outerViewProps?: ThemedViewProps;
  flatListStyle?: ViewStyle;
  posts?: any[]; // TODO create Post type ?
};

export default function PostFeed({
  outerViewProps,
  flatListStyle,
  posts = [0, 1, 2, 3],
}: PostFeedProps) {
  const heightPercentToDP = useWindowDimension("height");

  /*
      TODO PostFeed: pull posts from context, refreshing, comment/reaction icons,
      reaction dialog, layout
    */
  return (
    // POST BACKGROUND CONTAINER - flex here is important!
    <ThemedView
      colorName="secondary"
      style={[
        {
          flex: 1,
          height: "100%",
        },
        outerViewProps?.style,
      ]}
      {...outerViewProps}
    >
      {/* ACTUAL POST LIST */}
      <FlatList
        data={posts}
        keyExtractor={(index) => index.toString()}
        renderItem={({ item }) => <Post />} // TODO: pass postData to Post element
        contentContainerStyle={{ paddingBottom: 50 }}
        {...flatListStyle}
      />
    </ThemedView>
  );
}
