import React, {useCallback, useEffect} from "react";
import {
  FlatList,
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { usePostContext} from "@/context/PostContext";
import PostCard from "@/components/display/PostCard";
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import {useFocusEffect} from "expo-router";
import {useAuth} from "@/hooks/useAuth";


interface PostFeedProps {
  filterAuthorId?: string; // Optional prop for filtering posts by author
  refreshControl?: React.ReactElement; // Prop to accept RefreshControl
}


const PostFeed: React.FC<PostFeedProps> = ({ filterAuthorId, refreshControl }) => {  // @ts-ignore
  const { posts, fetchPosts, totalPages } = usePostContext();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const { authToken } = useAuth();


  // Function to refresh posts
  const handleRefresh = async () => {
    console.log("[POST FEED] handleRefresh")
    setIsRefreshing(true);
    await fetchPosts(0, 10); // Re-fetch the first page
    setIsRefreshing(false);
  };

  // Function to load more posts when the user scrolls to the end of the list
  const handleLoadMore = () => {
    const currentPage = Math.floor(posts.length / 10);
    if (currentPage < totalPages) {
      fetchPosts(currentPage, 10);
    }
  };

  // Trigger re-fetch when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      console.log("[POST FEED] fetching post on focus")
      if (authToken && authToken != "") {
        console.log("[POST FEED] authToken present")
        fetchPosts(0, 10); // Ensure the latest data is loaded when returning
      }
    }, [authToken])
  );



  // Render a single post using PostCard
  const renderPost = ({ item }) => <PostCard post={item} />;


  // Filter posts if `filterAuthorId` is provided
  const filteredPosts = filterAuthorId
    ? posts.filter((post) => post.author.userId === filterAuthorId)
    : posts;

  return (
    <View style={{
      flex: 1,
    }}>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }
        ListFooterComponent={
          filteredPosts.length > 0 ? (
            <ActivityIndicator size="small" style={styles.loadingIndicator} />
          ) : null
        }
        contentContainerStyle={styles.flatListContainer}
      />
      <View style={{
        height: heightPercentageToDP(15),
      }}></View>
    </View>

  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingVertical: 10,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default PostFeed;