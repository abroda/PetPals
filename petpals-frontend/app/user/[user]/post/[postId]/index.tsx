import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  SafeAreaView,
  Pressable,
  View,
  Alert,
  TextInput,
  Modal,
  useColorScheme,
} from "react-native";
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
import { widthPercentageToDP } from "react-native-responsive-screen";
import { apiPaths } from "@/constants/config/api";
import { useTextStyle } from "@/hooks/theme/useTextStyle";

export default function PostScreen() {
  const path = usePathname();
  const authorId = path.split("/")[2];
  const postId = path.split("/")[4];

  // Colors
  const colorScheme = useColorScheme();
  const themeColors = ThemeColors[colorScheme];

  const { userId: loggedInUserId } = useAuth();
  const {
    deletePost,
    fetchPostById,
    addComment,
    fetchComments,
    toggleLikePost,
    toggleLikeComment,
    editComment,
    deleteComment,
  } = usePostContext();
  const asyncAbortController = useRef<AbortController | undefined>();
  const { authToken } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(0);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null); // Track the comment being edited
  const [editedComment, setEditedComment] = useState(""); // Local state for the new comment content

  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");
  const tertiaryColor = useThemeColor("tertiary");
  const inputStyle = [useTextStyle({}), { color: useThemeColor("text") }];

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
          <View
            style={{
              backgroundColor: themeColors.tertiary,
              borderRadius: percentToDP(100),
              flexDirection: "row",
              padding: percentToDP(0.5),
            }}
          >
            {loggedInUserId === authorId && (
              <>
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
                <Pressable
                  style={{
                    padding: percentToDP(2),
                    paddingHorizontal: percentToDP(4),
                  }}
                  onPress={() =>
                    router.push(`/user/${authorId}/post/${postId}/edit`)
                  }
                >
                  <ThemedIcon
                    size={heightPercentToDP(4)}
                    colorName="primary"
                    name="pencil"
                  />
                </Pressable>
              </>
            )}
            {/*<UserAvatar size={12} userId={loggedInUserId}   doLink={false}/>*/}
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
        setLiked(result.likes.some((like) => like === loggedInUserId));
        setPostLikes(result.likes.length);
        console.log(
          "Is there like?  ",
          result.likes.map((like) => like)
        );
      }
      loadComments();
    }
    async function loadComments() {
      const commentList = await fetchComments(postId);
      setComments(commentList);
    }
    loadPost();

    return () => {
      asyncAbortController.current?.abort();
    };
  }, [fetchPostById]);

  // Delete post
  const handleDelete = useCallback(async () => {
    if (!post) {
      Alert.alert("Error", "Post data is not available. Please try again.");
      return;
    }

    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (post.imageUrl) {
                // Delete the post picture first
                const deletePictureResponse = await fetch(
                  apiPaths.posts.deletePicture(post.id),
                  {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${authToken}` },
                  }
                );

                if (!deletePictureResponse.ok) {
                  throw new Error("Failed to delete post picture.");
                }
                console.log("[PostScreen] Post picture deleted successfully.");
              }

              // Now delete the post itself
              const deletePostSuccess = await deletePost(post.id);

              if (!deletePostSuccess) {
                throw new Error("Failed to delete the post.");
              }

              console.log("[PostScreen] Post deleted successfully.");
              Alert.alert("Success", "Post deleted successfully!");
              router.replace(`/user/${authorId}`);
            } catch (error) {
              console.error("[PostScreen] Error deleting post:", error);
              Alert.alert(
                "Error",
                error.message || "Failed to delete the post."
              );
            }
          },
        },
      ]
    );
  }, [post, deletePost, authToken, authorId]);

  const handleToggleLike = async () => {
    if (loggedInUserId === authorId) {
      Alert.alert("Info", "You cannot like your own post.");
      return;
    }

    const success = await toggleLikePost(postId);
    if (success) {
      setLiked((prevLiked) => !prevLiked);
      setPostLikes((prevLikes) => (liked ? prevLikes - 1 : prevLikes + 1)); // Adjust local likes count
    } else {
      Alert.alert("Error", "Failed to toggle like. Please try again.");
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim().length > 0) {
      const success = await addComment(postId, newComment);
      if (success) {
        setNewComment("");
        const updatedComments = await fetchComments(postId);
        setComments(updatedComments);
        setCommentModalVisible(false);
      }
    } else {
      Alert.alert("Validation Error", "Comment cannot be empty.");
    }
  };

  // Edit comment
  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId); // Set the comment being edited
    setEditedComment(currentContent); // Pre-fill the modal with the existing comment content
    setCommentModalVisible(true); // Open the modal for editing
  };

  // Submit edited comment
  const submitEditedComment = async () => {
    if (editedComment.trim().length === 0) {
      Alert.alert("Validation Error", "Comment cannot be empty.");
      return;
    }
    const success = await editComment(editingCommentId, editedComment); // Backend call to edit the comment
    if (success) {
      setEditedComment("");
      setEditingCommentId(null);
      setCommentModalVisible(false);
      const updatedComments = await fetchComments(postId); // Refresh comments
      setComments(updatedComments);
    } else {
      Alert.alert("Error", "Failed to edit comment. Please try again.");
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteComment(commentId);
            if (success) {
              const updatedComments = await fetchComments(postId);
              setComments(updatedComments); // Refresh comments
            } else {
              Alert.alert(
                "Error",
                "Failed to delete comment. Please try again."
              );
            }
          },
        },
      ]
    );
  };

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
      <ThemedScrollView
        colorName="secondary"
        style={{ flex: 1 }}
      >
        <ThemedView
          style={{ flex: 1 }}
          colorName={"secondary"}
        >
          {/* Post Image */}
          {post.imageUrl ? (
            <ThemedView
              style={{
                width: percentToDP(100),
                height: percentToDP(110),
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
                width: percentToDP(100),
                height: percentToDP(110),
                backgroundColor: themeColors.secondary,
                alignItems: "center",
                justifyContent: "center",
                borderBottomWidth: 1,
                borderColor: themeColors.tertiary,
              }}
            >
              <ThemedIcon
                name={"image"}
                size={30}
                style={{ marginBottom: percentToDP(1) }}
              />
              <ThemedText
                backgroundColorName={"transparent"}
                textColorName={"primary"}
              >
                No image
              </ThemedText>
            </View>
          )}

          {/* Post Header */}
          <HorizontalView
            justifyOption="flex-start"
            colorName="transparent"
            style={{
              marginTop: percentToDP(5),
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
            <ThemedText
              backgroundColorName={"transparent"}
              style={{ marginLeft: percentToDP(2) }}
            >
              {post.author.username}
            </ThemedText>
            {post.author.userId === loggedInUserId ? (
              <ThemedText
                textStyleOptions={{ size: "medium" }}
                backgroundColorName={"transparent"}
                textColorName={"placeholderText"}
                style={{ marginLeft: percentToDP(2) }}
              >
                [you]
              </ThemedText>
            ) : (
              <></>
            )}
          </HorizontalView>

          {/* Title and Description */}
          <ThemedText
            backgroundColorName={"transparent"}
            textStyleOptions={{ size: "big", weight: "bold" }}
            style={{
              width: "100%",
              marginBottom: percentToDP(2),
              paddingHorizontal: percentToDP(5),
            }}
          >
            {post.title || "No title"}
          </ThemedText>

          <ThemedText
            backgroundColorName={"transparent"}
            textStyleOptions={{ size: "medium" }}
            style={{
              marginBottom: percentToDP(5),
              paddingHorizontal: percentToDP(5),
            }}
          >
            {post.description || "No description"}
          </ThemedText>

          {/* Likes Section */}
          <HorizontalView
            justifyOption="space-between"
            style={{
              alignItems: "center",
              marginVertical: percentToDP(5),
              paddingHorizontal: percentToDP(5),
              backgroundColor: themeColors.transparent,
            }}
          >
            <ThemedText
              backgroundColorName={"transparent"}
              textColorName={"primary"}
              textStyleOptions={{ size: "small" }}
            >
              {formatDateTime(post.createdAt)}
            </ThemedText>

            <HorizontalView
              justifyOption="flex-end"
              alignItems="center"
              colorName={"transparent"}
            >
              <Pressable onPress={handleToggleLike}>
                <ThemedIcon
                  name={liked ? "heart" : "heart-outline"}
                  style={{ marginRight: 8 }}
                />
              </Pressable>
              <ThemedText backgroundColorName={"transparent"}>
                {postLikes}
              </ThemedText>
            </HorizontalView>
          </HorizontalView>

          {/* Comments Section */}
          <ThemedView style={{ padding: percentToDP(5) }}>
            <ThemedText textStyleOptions={{ size: "big" }}>Comments</ThemedText>
            {comments.length == 0 ? (
              <ThemedText
                backgroundColorName={"transparent"}
                textColorName={"placeholderText"}
                style={{ marginTop: percentToDP(2) }}
              >
                No comments yet. Be the first!
              </ThemedText>
            ) : (
              <></>
            )}
            {comments.map((comment) => (
              <ThemedView
                key={comment.commentId}
                style={{
                  marginVertical: percentToDP(2),
                  padding: percentToDP(3),
                  borderColor: themeColors.secondary,
                  borderWidth: 1,
                  borderRadius: percentToDP(4),
                }}
              >
                <HorizontalView
                  justifyOption="space-between"
                  style={{ marginBottom: percentToDP(2) }}
                >
                  <HorizontalView justifyOption="flex-start">
                    <UserAvatar
                      size={8}
                      userId={comment.commenter.userId}
                      imageUrl={comment.commenter.imageUrl}
                      doLink={true}
                    />
                    <ThemedText
                      style={{
                        marginLeft: percentToDP(2),
                        maxWidth: percentToDP(35),
                      }}
                      numberOfLines={1}
                    >
                      {comment.commenter.username}
                    </ThemedText>
                    {comment.commenter.userId === loggedInUserId ? (
                      <ThemedText
                        backgroundColorName={"transparent"}
                        textStyleOptions={{ size: "tiny" }}
                        textColorName={"placeholderText"}
                        style={{ marginLeft: percentToDP(2) }}
                      >
                        [Your comment]
                      </ThemedText>
                    ) : (
                      <></>
                    )}
                  </HorizontalView>

                  <HorizontalView
                    justifyOption="flex-end"
                    alignItems="center"
                  >
                    {comment.commenter.userId === loggedInUserId ? (
                      // If the comment is owned by the logged-in user, display a filled, non-interactive heart
                      <>
                        <ThemedIcon
                          name="heart"
                          colorName={"placeholderText"}
                          style={{ marginRight: 8 }}
                        />
                        <ThemedText>{comment.likes.length}</ThemedText>
                      </>
                    ) : (
                      // Otherwise, allow toggling the like
                      <>
                        <Pressable
                          onPress={async () => {
                            const success = await toggleLikeComment(
                              comment.commentId
                            );
                            if (success) {
                              // @ts-ignore
                              setComments((prevComments) =>
                                prevComments.map((c) =>
                                  c.commentId === comment.commentId
                                    ? {
                                        ...c,
                                        likes: c.likes.some(
                                          (like) => like === loggedInUserId
                                        )
                                          ? c.likes.filter(
                                              (like) => like !== loggedInUserId
                                            )
                                          : [...c.likes, loggedInUserId],
                                      }
                                    : c
                                )
                              );
                            } else {
                              Alert.alert(
                                "Error",
                                "Failed to toggle like. Please try again."
                              );
                            }
                          }}
                        >
                          <ThemedIcon
                            name={
                              comment.likes.some(
                                (like) => like === loggedInUserId
                              )
                                ? "heart"
                                : "heart-outline"
                            }
                            style={{ marginRight: 8 }}
                          />
                        </Pressable>
                        <ThemedText>{comment.likes.length}</ThemedText>
                      </>
                    )}
                  </HorizontalView>
                </HorizontalView>

                {/* Comment content */}
                <ThemedText>{comment.content}</ThemedText>

                <HorizontalView
                  style={{
                    marginTop: percentToDP(5),
                    alignItems: "flex-start",
                  }}
                >
                  {/* Creation time */}
                  <ThemedText
                    backgroundColorName={"transparent"}
                    textColorName={"primary"}
                    textStyleOptions={{ size: "small" }}
                    style={{
                      height: "100%",
                      textAlignVertical: "center",
                    }}
                  >
                    {formatDateTime(comment.createdAt)}
                  </ThemedText>

                  {/* Edit and Delete Buttons */}
                  {loggedInUserId === comment.commenter.userId && (
                    <HorizontalView
                      justifyOption="flex-end"
                      style={{}}
                    >
                      <ThemedButton
                        label={"Edit"}
                        size={"small"}
                        style={{
                          width: "50",
                          height: "90%",
                          marginRight: percentToDP(2),
                        }}
                        onPress={() =>
                          handleEditComment(comment.commentId, comment.content)
                        }
                      />
                      <ThemedButton
                        label={"Delete"}
                        size={"small"}
                        style={{
                          width: "50",
                          height: "90%",
                        }}
                        onPress={() => handleDeleteComment(comment.commentId)}
                      />
                    </HorizontalView>
                  )}
                </HorizontalView>
              </ThemedView>
            ))}

            <ThemedButton
              label="Add Comment"
              onPress={() => setCommentModalVisible(true)}
              style={{
                marginTop: percentToDP(5),
                width: "50%",
                height: "10",
              }}
            />
          </ThemedView>
        </ThemedView>
      </ThemedScrollView>

      {/* Add/Edit Comment Modal */}
      <Modal
        visible={isCommentModalVisible}
        transparent={true}
        animationType="slide"
      >
        <ThemedView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <ThemedView
            style={{
              width: percentToDP(90),
              padding: percentToDP(5),
              backgroundColor: themeColors.background,
              borderRadius: 8,
            }}
          >
            <ThemedText textStyleOptions={{ size: "big" }}>
              {editingCommentId ? "Edit Comment" : "Add Comment"}
            </ThemedText>
            <TextInput
              value={editingCommentId ? editedComment : newComment}
              onChangeText={editingCommentId ? setEditedComment : setNewComment}
              placeholder="Enter your comment..."
              maxLength={200}
              style={[
                {
                  borderWidth: 1,
                  borderColor: themeColors.primary,
                  borderRadius: 4,
                  padding: 10,
                  marginVertical: percentToDP(5),
                },
                inputStyle,
              ]}
            />
            <HorizontalView justifyOption="space-between">
              <ThemedButton
                label="Cancel"
                onPress={() => {
                  setCommentModalVisible(false);
                  setEditingCommentId(null);
                  setEditedComment("");
                }}
                style={{ width: "45%" }}
              />
              <ThemedButton
                label="Send"
                onPress={
                  editingCommentId ? submitEditedComment : handleAddComment
                }
                style={{ width: "45%" }}
              />
            </HorizontalView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </SafeAreaView>
  );
}
