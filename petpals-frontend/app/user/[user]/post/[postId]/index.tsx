import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { SafeAreaView, Pressable, View, Alert, useColorScheme } from "react-native";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import UserAvatar from "@/components/navigation/UserAvatar";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { router, useNavigation, usePathname } from "expo-router";
import { usePostContext } from "@/context/PostContext";
import { Image } from "react-native-ui-lib";
import { ThemeColors } from "@/constants/theme/Colors";
import { useAuth } from "@/hooks/useAuth";
import formatDateTime from "@/helpers/dateStringToFormattedDate";

export default function PostScreen() {
  const path = usePathname();
  const authorId = path.split("/")[2];
  const postId = path.split("/")[4];

  // Colors
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];

  const { userId: loggedInUserId } = useAuth();
  const { fetchPostById, deletePost, deletePostPicture } = usePostContext();
  const asyncAbortController = useRef<AbortController | undefined>();

  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);

  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");
  const tertiaryColor = useThemeColor("tertiary");

  // Header styling
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerStyle: { backgroundColor: themeColors.secondary },
      headerShown: true,
      headerRight: () => (
        <View
          style={{
            backgroundColor: themeColors.transparent,
            paddingVertical: percentToDP(2),
          }}
        >
          {/* Rounded group */}
          <View
            style={{
              backgroundColor: themeColors.tertiary,
              borderRadius: percentToDP(100),
              flexDirection: "row",
              padding: percentToDP(0.5),
            }}
          >
            {/* Delete Button */}
            {loggedInUserId === authorId && (
              <Pressable
                style={{
                  padding: percentToDP(2),
                  paddingHorizontal: percentToDP(4),
                }}
                onPress={handleDelete}
              >
                <ThemedIcon
                  size={heightPercentToDP(4)}
                  colorName="error"
                  name="close-circle"
                />
              </Pressable>
            )}

            {/* Edit Button */}
            {loggedInUserId === authorId && (
              <Pressable
                style={{
                  padding: percentToDP(2),
                  paddingHorizontal: percentToDP(4),
                }}
                onPress={() => router.push(`/user/${authorId}/post/${postId}/edit`)}
              >
                <ThemedIcon
                  size={heightPercentToDP(4)}
                  colorName="primary"
                  name="pencil"
                />
              </Pressable>
            )}

            {/* Currently logged-in user's avatar */}
            <UserAvatar size={12} userId={loggedInUserId} />
          </View>
        </View>
      ),
    });
  }, [navigation, loggedInUserId, authorId]);

  // Fetching post data
  useEffect(() => {
    async function loadPost() {
      asyncAbortController.current = new AbortController();
      const result = await fetchPostById(postId);
      console.log("[Post/Index] Fetched post: ", result.author);
      if (result) {
        setPost(result);
      }
    }
    loadPost();

    return () => {
      asyncAbortController.current?.abort();
    };
  }, [fetchPostById]);

  const handleDelete = useCallback(async () => {
    Alert.alert("Confirm Deletion", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // Delete the post's picture if it exists
            if (post?.imageUrl) {
              console.log("[Post/Index] Deleting picture...");
              const pictureDeleted = await deletePostPicture(postId);
              if (!pictureDeleted) {
                throw new Error("Failed to delete post picture.");
              }
            }

            // Delete the post itself
            console.log("[Post/Index] Deleting post...");
            const postDeleted = await deletePost(postId);
            if (!postDeleted) {
              throw new Error("Failed to delete post.");
            }

            Alert.alert("Success", "Post deleted successfully!");
            router.replace(`/`);
          } catch (error) {
            console.error("[Post/Index] Error deleting post:", error);
            Alert.alert("Error", "Failed to delete the post. Please try again.");
          }
        },
      },
    ]);
  }, [post, postId, deletePostPicture, deletePost]);

  if (!post) {
    return (
      <ThemedLoadingIndicator
        size="large"
        fullScreen={true}
        message="Loading post data..."
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedScrollView colorName="secondary" style={{ flex: 1 }}>
        <ThemedView style={{ flex: 1 }}>
          {/* Post Image */}
          {post.imageUrl ? (
            <ThemedView
              style={{
                width: percentToDP(100),
                height: percentToDP(110),
                marginBottom: percentToDP(5),
              }}
            >
              <Image
                source={{ uri: post.imageUrl }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </ThemedView>
          ) : (
            <View
              style={{
                width: "100%",
                height: percentToDP(100),
                backgroundColor: themeColors.secondary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThemedText>No Image Available</ThemedText>
            </View>
          )}

          {/* Post Header */}
          <HorizontalView
            justifyOption="flex-start"
            colorName="transparent"
            style={{
              marginBottom: percentToDP(5),
              paddingHorizontal: percentToDP(5),
            }}
          >
            <UserAvatar
              size={13}
              doLink={true}
              userId={post.author.userId}
              imageUrl={post.author.imageUrl}
            />
            <ThemedText style={{ marginLeft: percentToDP(2) }}>
              {post.author.username}
            </ThemedText>
          </HorizontalView>

          {/* Title and Description */}
          <ThemedText style={{ marginBottom: percentToDP(2), paddingHorizontal: percentToDP(5) }}>
            {post.title || "No title"}
          </ThemedText>

          <ThemedText style={{ marginBottom: percentToDP(5), paddingHorizontal: percentToDP(5) }}>
            {post.description || "No description"}
          </ThemedText>

          {/* Likes */}
          <HorizontalView
            justifyOption="space-between"
            style={{
              alignItems: "center",
              marginVertical: percentToDP(5),
              paddingHorizontal: percentToDP(5),
            }}
          >
            <ThemedText>{formatDateTime(post.createdAt)}</ThemedText>

            <Pressable onPress={() => setLiked(!liked)}>
              <ThemedIcon name={liked ? "heart" : "heart-outline"} />
            </Pressable>
          </HorizontalView>
        </ThemedView>
      </ThemedScrollView>
    </SafeAreaView>
  );
}
