import React, { useEffect, useState } from "react";
import { ImageStyle, Pressable, StyleProp } from "react-native";
import { Avatar } from "react-native-ui-lib";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import UserPlaceholder from "@/assets/images/user_placeholder_theme-color-fair.png"

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
  const [hasFetched, setHasFetched] = useState(false);

  const borderColor = useThemeColor("primary");

  useEffect(() => {

    if (props.imageUrl) {
      console.log("[UserAvatar] got valid imageUrl:", props.imageUrl);
      setAvatarUrl(props.imageUrl);
    } else {
      setAvatarUrl(null)
    }

    // if (!props.imageUrl && props.imageUrl == "NoImage"){
    //   setAvatarUrl(null);
    // }
    // else {
    //     if (!props.imageUrl && props.userId) {
    //     console.log("[UserAvatar] fetching user by id: ", props.userId);
    //     try {
    //       fetchUserById(props.userId).then((user)=> {setAvatarUrl(user?.imageUrl ?? null)});
    //     } catch (error) {
    //       console.error("[UserAvatar] Failed to fetch user data:", error);
    //       setAvatarUrl(null); // Default to null if there's an error
    //     }
    //   }
    // }

  }, [props.imageUrl, props.userId, avatarUrl]);


  useEffect(() => {
    console.log("[UserAvatar] Props changed:", {
      userId: props.userId,
      imageUrl: props.imageUrl,
    });
  }, [props.userId, props.imageUrl]);


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
        source={
          avatarUrl
            ? { uri: avatarUrl } // Use the fetched or passed avatar URL
            : UserPlaceholder // Fallback to placeholder image
        }
        containerStyle={[
          { borderRadius: percentToDP(props.size) / 2 },
          props.style,
        ]}
      />
    </Pressable>
  );
}
