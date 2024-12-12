import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { SafeAreaView, View, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { ThemedTextField } from "@/components/inputs/ThemedTextField";
import { ThemedMultilineTextField } from "@/components/inputs/ThemedMultilineTextField";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedText } from "@/components/basic/ThemedText";
import { Image } from "react-native-ui-lib";
import { useNavigation, router } from "expo-router";
import { usePostContext } from "@/context/PostContext";
import { useAuth } from "@/hooks/useAuth";
import { apiPaths } from "@/constants/config/api";

export default function NewPostScreen() {
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");
  const secondaryColor = useThemeColor("secondary");
  const backgroundColor = useThemeColor("background");
  const { addPost } = usePostContext();
  const { authToken, userId } = useAuth();

  // Input States
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | Blob | null>(null);
  const [validationMessage, setValidationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Input Refs
  const postTitleRef = useRef(null);
  const postDescriptionRef = useRef(null);

  // Navigation
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Add Post and Photo
  const handleSavePost = useCallback(async () => {
    if (!postTitle.trim()) {
      setValidationMessage("Post title is required.");
      return;
    }

    setIsSubmitting(true);

    const postPayload = {
      title: postTitle,
      description: postDescription,
      userId,
    };

    try {
      // Create the post
      const newPost = await addPost(postPayload);

      if (!newPost) {
        throw new Error("Failed to add the post.");
      }

      console.log("[NewPostScreen] Post added successfully:", newPost);

      // If photo is selected, upload it
      if (photoFile) {
        const formData = new FormData();
        formData.append("file", {
          uri: photoFile.uri,
          name: photoFile.uri.split("/").pop(), // Extract file name
          type: "image/jpeg", // Adjust MIME type as needed
        } as unknown as File);

        const path = apiPaths.posts.addPicture(newPost.id);

        const response = await fetch(path, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorResponse = await response.text();
          console.error("[NewPostScreen] Failed to upload photo:", errorResponse);
          throw new Error("Photo upload failed.");
        }

        console.log("[NewPostScreen] Photo uploaded successfully.");
      }

      Alert.alert("Success", "Post created successfully!");
      router.replace(`/`);
    } catch (error) {
      console.error("[NewPostScreen] Error:", error);
      Alert.alert("Error", error.message || "Failed to create the post.");
    } finally {
      setIsSubmitting(false);
    }
  }, [postTitle, postDescription, photoFile, addPost, authToken, userId]);

  // Image Selection
  const selectPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      setPhoto(uri);
      setPhotoFile({
        uri,
        name: uri.split("/").pop(), // Extract file name
        type: "image/jpeg", // Adjust MIME type as needed
      });
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
    setPhotoFile(null);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Top Navigation */}
      <ThemedView style={{ height: heightPercentToDP(10) }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
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
              name="arrow-back"
              size={heightPercentToDP(4)}
              colorName="primary"
            />
          </ThemedButton>

          {/* Save Button */}
          <ThemedButton
            backgroundColorName="background"
            style={{
              height: heightPercentToDP(7),
              width: heightPercentToDP(7),
            }}
            onPress={handleSavePost}
          >
            <ThemedIcon
              name="checkmark"
              size={heightPercentToDP(4)}
              colorName="primary"
            />
          </ThemedButton>
        </View>
      </ThemedView>

      {/* Form */}
      <ThemedScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: percentToDP(5) }}
      >
        {/* Image Section */}
        <ThemedView
          style={{
            width: percentToDP(90),
            height: percentToDP(90),
            marginBottom: percentToDP(10),
            borderRadius: 30,
          }}
        >
          {photo ? (
            <View
              style={{
                borderRadius: 30,
                borderWidth: 1,
                borderColor: secondaryColor,
              }}
            >
              <Image
                source={{ uri: photo }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 30,
                }}
              />

              {/* Edit Button */}
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: backgroundColor,
                  borderRadius: 30,
                  height: heightPercentToDP(7),
                  width: heightPercentToDP(7),
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: secondaryColor,
                  borderWidth: 1,
                }}
                onPress={selectPhoto}
              >
                <ThemedIcon name="pencil" size={heightPercentToDP(4)} />
              </TouchableOpacity>

              {/* Clear Button */}
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: heightPercentToDP(7) + 20,
                  right: 10,
                  backgroundColor: backgroundColor,
                  borderRadius: 30,
                  height: heightPercentToDP(7),
                  width: heightPercentToDP(7),
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: secondaryColor,
                  borderWidth: 1,
                }}
                onPress={clearPhoto}
              >
                <ThemedIcon name="close" size={heightPercentToDP(4)} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: "rgba(0,0,0,0.1)",
                borderRadius: 30,
                borderWidth: 1,
                borderColor: secondaryColor,
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={selectPhoto}
            >
              <ThemedIcon name="camera" />
              <ThemedText>Tap to select photo</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>

        {/* Title Input */}
        <ThemedTextField
          ref={postTitleRef}
          label="Post Title"
          value={postTitle}
          onChangeText={setPostTitle}
          validate={["required"]}
          validationMessage={["Post title is required"]}
          maxLength={100}
        />

        {/* Description Input */}
        <ThemedMultilineTextField
          ref={postDescriptionRef}
          label="Post Description"
          value={postDescription}
          onChangeText={setPostDescription}
          maxLength={255}
          style={{ marginBottom: percentToDP(10) }}
        />

        {/* Validation Error Message */}
        {validationMessage ? (
          <ThemedText textColorName="error">{validationMessage}</ThemedText>
        ) : null}
      </ThemedScrollView>

      {isSubmitting && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <ThemedText>Saving...</ThemedText>
        </View>
      )}
    </SafeAreaView>
  );
}
