import React, {useCallback, useEffect, useState, useRef, useLayoutEffect} from "react";
import {SafeAreaView, View, StyleSheet, Alert, Pressable, TextInput} from "react-native";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedTextField } from "@/components/inputs/ThemedTextField";
import { ThemedMultilineTextField } from "@/components/inputs/ThemedMultilineTextField";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { usePostContext } from "@/context/PostContext";
import {router, useNavigation, usePathname} from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native-ui-lib";
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {ThemeColors} from "@/constants/theme/Colors";
import {ThemedText} from "@/components/basic/ThemedText";
import {useAuth} from "@/hooks/useAuth";
import {apiPaths} from "@/constants/config/api";



export default function EditPostScreen() {

  // Path Data
  const path = usePathname();
  const authorId = path.split("/")[2];
  const postId = path.split("/")[4];

  // Contexts
  const { fetchPostById, editPost, savePhoto } = usePostContext();
  const navigation = useNavigation();
  const { authToken } = useAuth();

  // Post Data
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState<File | Blob | null>(null);
  const [photo, setPhoto] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Styling
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");
  const secondaryColor = useThemeColor("secondary");
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            backgroundColor: themeColors.transparent,
            padding: percentToDP(1),
            borderRadius: 100,
            marginVertical: heightPercentToDP(1),
          }}
        >


        </View>
      ),
      headerTitle: "Edit Post",
      headerStyle: {
        backgroundColor: themeColors.secondary,
      },
    });
  }, [])


  // Fetch the post
  useEffect(() => {
    async function loadPost() {
      const fetchedPost = await fetchPostById(postId);
      if (fetchedPost) {
        setPost(fetchedPost);
        setTitle(fetchedPost.title || "");
        setDescription(fetchedPost.description || "");
        setPhoto(fetchedPost.imageUrl || null);
        console.log("[Post/Edit] fetched post data: ", fetchedPost.title, " | desc: ", fetchedPost.description)
      }
    }
    loadPost();
  }, [postId]);


  // useEffect(() => {
  //   if (post) {
  //     console.log("[EditPost] Populating title and description:", post.title, post.description);
  //     setTitle(post.title || ""); // Ensure non-null string
  //     setDescription(post.description || ""); // Ensure non-null string
  //   }
  // }, [post]);



  // Save new data
  const handleSave = useCallback(async () => {
    console.log("[Post/Edit] Title set: ", title);
    console.log("[Post/Edit] Description set: ", description);

    if (!title.trim()) {
      Alert.alert("Validation Error", "Title cannot be empty.");
      return;
    }

    const updatedData = {
      title,
      description,
    };
    console.log("Updated Data:", updatedData);

    // Editing post data on backend
    setIsSubmitting(true);
    const success = await editPost(postId, updatedData);
    setIsSubmitting(false);

    if (success) {
      Alert.alert("Success", "Post updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("Error", "Failed to update post. Please try again.");
    }
  }, [title, description, postId]);


  // Select new photo
  const selectPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const file = {
        uri,
        name: uri.split("/").pop(), // Extract the file name
        type: "image/jpeg", // Change if needed
      };
      setPhotoFile(file);
      setPhoto(uri); // Set the preview URL
    }
  };

  const handleSavePhoto = useCallback(async () => {
    if (!photoFile) {
      console.log("[EditPost] No photo selected. Skipping photo save.");
      return true;
    }

    try {
      console.log("[EditPost] Saving photo for post ID:", postId);

      const formData = new FormData();
      formData.append("file", {
        uri: photoFile.uri,
        name: photoFile.uri.split("/").pop(),
        type: "image/jpeg",
      } as unknown as File);
      //console.log("[EditPost] FormData:", formData);

      const response = await fetch(apiPaths.posts.addPicture(postId), {
        method: "PUT",
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });

      // Old version that worked
      // const path = apiPaths.posts.addPicture(postId);
      // const response = await fetch(path, {
      //   method: "PUT",
      //   headers: {
      //     Authorization: `Bearer ${authToken}`, // Add token if needed
      //   },
      //   body: formData,
      // });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("[EditPost] Photo save failed:", errorResponse);
        throw new Error(errorResponse);
      }

      const responseData = await response.json();
      console.log("[EditPost] Photo saved successfully:", responseData);
      return true;
    } catch (error) {
      console.error("[EditPost] Error saving photo:", error);
      return false;
    }
  }, [photoFile, postId, authToken]);



  // Just deleting a picture
  const handleDeletePicture = async () => {
    try {
      const response = await fetch(apiPaths.posts.deletePicture(postId), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) throw new Error(await response.text());

      setPhoto(null); // Update UI
      Alert.alert("Success", "Picture deleted successfully.");
    } catch (error) {
      console.error("Error deleting picture:", error);
      Alert.alert("Error", "Failed to delete picture.");
    }
  };


  const handleSaveAll = async () => {
    setIsSubmitting(true);
    try {
      const dataSaved = await handleSave(); // Save post data
      const photoSaved = await handleSavePhoto(); // Save photo

      // @ts-ignore
      if (dataSaved && photoSaved) {
        Alert.alert("Success", "Post updated successfully!");
        router.back();
      } else {
        Alert.alert("Error", "Failed to update post. Please try again.");
      }
    } catch (error) {
      console.error("[EditPost] Error saving post or photo:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false); // End loading state
    }
  };

  if (!post || isSubmitting) {
    return (
      <ThemedView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedIcon name="hourglass-outline" size={30} />
        <ThemedText>{isSubmitting ? "Saving..." : "Loading..."}</ThemedText>
      </ThemedView>
    );
  }


  if (!post) {
    return (
      <ThemedView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedIcon name="hourglass-outline" size={40} />
        <ThemedButton
          label="Back"
          onPress={() => router.back()}
          style={{ marginTop: percentToDP(5) }}
        />
      </ThemedView>
    );
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>

      {/* Navigation Header */}
      <ThemedView style={{ height: heightPercentToDP(10) }}>
        <HorizontalView
          colorName="secondary"
          style={{
            height: heightPercentToDP(10),
            paddingHorizontal: percentToDP(5),
          }}
        >
          {/* Back Button */}
          <ThemedButton
            backgroundColorName="background"
            style={{
              height: heightPercentToDP(7),
              width: heightPercentToDP(7),
            }}
            onPress={() => router.back()}
          >
            <ThemedIcon
              size={heightPercentToDP(4)}
              colorName="primary"
              name="arrow-back"
            />
          </ThemedButton>


        </HorizontalView>
      </ThemedView>

      <ThemedScrollView colorName="secondary">
        <ThemedView
          style={{
            padding: percentToDP(5),
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            marginTop: percentToDP(5),
          }}
        >
          {/* Image Section */}
          <ThemedView
            style={{
              width: percentToDP(90),
              height: percentToDP(90),
              marginBottom: percentToDP(5),
              borderRadius: 30,
            }}
          >
            {photo ? (
              <View style={{ position: "relative" }}>
                <Image source={{ uri: photo }} style={{ width: "100%", height: "100%" }} />
                <ThemedButton
                  backgroundColorName="background"
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    height: 40,
                    width: 40,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={handleDeletePicture}
                >
                  <ThemedIcon name="close" size={24} colorName="error" />
                </ThemedButton>
              </View>
            ) : (
              <ThemedButton
                backgroundColorName="background"
                style={{
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 30,
                  borderWidth: 1,
                  borderColor: themeColors.secondary,
                }}
                onPress={selectPhoto} // Placeholder
              >
                <ThemedIcon name="camera" size={24} />
                <ThemedText>Select Photo</ThemedText>
              </ThemedButton>
            )}
          </ThemedView>

          {/* Title */}
          <ThemedTextField
            label="Title"
            value={title}
            placeholder="Enter title" // Generic placeholder
            onChangeText={(text) => {
              console.log("[EditPost] Title changed to:", text);
              setTitle(text);
            }}
            withValidation
            validate={["required"]}
            validationMessage={["Title is required."]}
          />

          <ThemedTextField
            label="Description"
            value={description}
            placeholder="Enter description"
            onChangeText={(text) => {
              console.log("[EditPost] Description changed to:", text);
              setDescription(text);
            }}
          />
          <ThemedButton
            label="Save"
            onPress={handleSaveAll}
            color={themeColors.primary}
            style={{
              width: widthPercentageToDP(90),
              backgroundColor: "transparent",
              paddingVertical: percentToDP(2),
              borderRadius: percentToDP(4),
              borderWidth: 1,
              borderColor: themeColors.primary,
              marginVertical: heightPercentageToDP(5),
            }}
          />
        </ThemedView>
      </ThemedScrollView>
    </SafeAreaView>
  );
}
