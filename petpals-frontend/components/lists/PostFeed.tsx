import {
  ThemedView,
  ThemedViewProps,
} from "@/components/basic/containers/ThemedView";
import { FlatList } from "react-native-gesture-handler";
import Post from "@/components/display/Post";
import { ViewStyle } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import { PostType } from "@/context/PostContext";

export type PostFeedProps = {
  outerViewProps?: ThemedViewProps;
  flatListStyle?: ViewStyle;
};

export default function PostFeed({
  outerViewProps,
  flatListStyle,
}: PostFeedProps) {
  const { getFeed, isProcessing } = usePosts();
  const asyncAbortController = useRef<AbortController | undefined>();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const size = 10;

  const [refreshing, setRefreshing] = useState(false);
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);

  // Initial load
  useEffect(() => {
    //getData();

    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  const getData = useCallback(async () => {
    if (!hasMore) return;
    console.log("Start loading");
    asyncAbortController.current = new AbortController();
    let result = await getFeed(currentPage, size, asyncAbortController.current);
    if (result.success) {
      setPosts((prevPosts) => [...prevPosts, ...result.returnValue.content]);
      setHasMore(result.returnValue.page.totalPages > currentPage);
      setCurrentPage((prevPage) => prevPage + 1);
    }
    console.log("Stop loading");
  }, [currentPage, posts, hasMore]);

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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Post postFromFeed={item} />}
        contentContainerStyle={{ paddingBottom: 50 }}
        {...flatListStyle}
        onEndReached={() => {
          if (hasMore && !isProcessing) {
            //getData();
          }
        }}
      />
    </ThemedView>
  );
}
