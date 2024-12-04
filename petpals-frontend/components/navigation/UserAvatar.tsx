import React, { useEffect, useState } from "react";
import { ImageStyle, Pressable, StyleProp } from "react-native";
import { Avatar } from "react-native-ui-lib";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser"; // Assuming this is where getUserById is located
import {useWindowDimension} from "@/hooks/theme/useWindowDimension";

export default function UserAvatar(props: {
  size: number;
  userId: string;
  imageUrl?: string; // Accepts the S3 image URL
  doLink: boolean;
  marked?: boolean;
  style?: StyleProp<ImageStyle>; // Adding the style prop
}) {
  const { userId: loggedInUserId } = useAuth();
  const { fetchUserById } = useUser(); // Function to fetch user data by ID
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const percentToDP = useWindowDimension("shorter");

  useEffect(() => {
    const fetchUserImage = async () => {
      // console.log("[UserAvatar] Received userId to find: ", props.userId);
      if (!props.imageUrl && props.userId) {
        try {
          const user = await fetchUserById(props.userId);
          // console.log("[UserAvatar] Fetching user for avatar: ", user);
          setAvatarUrl(user.imageUrl || null); // Use fetched image URL if available
        } catch (error) {
          console.error("Failed to fetch user data for avatar:", error);
          setAvatarUrl(null); // Default to null if there's an error
        }
      }
    };

    fetchUserImage();
  }, [props.imageUrl, props.userId]);

  return (
    <Pressable
      onPress={() =>
        props.doLink
          ? router.push(
            loggedInUserId === props.userId
              ? "/user/me"
              : `/user/${props.userId}`
          )
          : {}
      }
      style={
        props.marked
          ? {
              borderWidth: props.marked ? percentToDP(0.8) : 0,
              borderColor: borderColor,
              borderRadius: percentToDP(props.size),
            }
          : {}
      }
    >
      <Avatar
        size={percentToDP(props.size)}
        source={{
          uri:
            props.imageUrl ||
            avatarUrl ||
            "https://external-preview.redd.it/PzM9Myb5uugh3qrxvb1F0nVTsdXJKRl0NB88MuAPwZA.jpg?auto=webp&s=6627165dbd61ab8a8d7fc026b5ce9199c593fe93", // Fallback URL
        }}
        containerStyle={[
          { borderRadius: percentToDP(props.size) / 2 },
          props.style,
        ]}
      />
    </Pressable>
  );
}
