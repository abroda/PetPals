import React, { useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { usePostContext} from "@/context/PostContext";
import PostCard from "@/components/display/PostCard";
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";


interface PostFeedProps {
  filterAuthorId?: string; // Optional prop for filtering posts by author
}

const PostFeed: React.FC<PostFeedProps> = ({ filterAuthorId }) => {
  // @ts-ignore
  const { posts, fetchPosts, totalPages } = usePostContext();

  // Fetch the first page of posts on component mount
  useEffect(() => {
    fetchPosts(0, 10); // Load the first page with 10 posts
  }, [posts, totalPages]);

  // Function to load more posts when the user scrolls to the end of the list
  const handleLoadMore = () => {
    const currentPage = Math.floor(posts.length / 10);
    if (currentPage < totalPages) {
      fetchPosts(currentPage, 10);
    }
  };


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