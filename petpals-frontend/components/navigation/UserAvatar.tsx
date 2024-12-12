import React, { useEffect, useState } from "react";
import {ActivityIndicator, ImageStyle, Pressable, StyleProp, View} from "react-native";
import { Avatar } from "react-native-ui-lib";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import {Image} from "react-native-ui-lib";
//import UserPlaceholder from "@/assets/images/user_placeholder_theme-color-fair.png";

const userPlaceholder = require("@/assets/images/user_placeholder_theme-color-fair.png");

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
  const borderColor = useThemeColor("primary");
  const percentToDP = useWindowDimension("shorter");

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isImageLoading, setImageLoading] = useState<boolean>(true); // Track image loading state


  useEffect(() => {
    if (props.imageUrl) {
      // console.log("[UserAvatar] got valid imageUrl:", props.imageUrl);
      setAvatarUrl(props.imageUrl);
    } else {
      setAvatarUrl(null);
      setImageLoading(false); // No image to load
    }
  }, [props.imageUrl]);

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
      <View
        style={{
          position: "relative",
          width: percentToDP(props.size),
          height: percentToDP(props.size),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Loading Indicator */}
        {isImageLoading && (
          <ActivityIndicator
            size="small"
            color={borderColor}
            style={{
              position: "absolute",
              zIndex: 1,
            }}
          />
        )}

        {/* Image */}
        <Image
          source={
            avatarUrl
              ? { uri: avatarUrl } // Use the fetched or passed avatar URL
              : userPlaceholder // Fallback to placeholder image
          }
          style={[
            {
              width: percentToDP(props.size),
              height: percentToDP(props.size),
              borderRadius: percentToDP(props.size) / 2, // Circular styling
            },
            props.style,
          ]}
          onLoadEnd={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />
      </View>
    </Pressable>
  );

  // Old working version, but Avatar does not support onLoadEnd needed for loading indicator
  // return (
  //   <Pressable
  //     onPress={() =>
  //       props.doLink
  //         ? router.push(
  //             loggedInUserId === props.userId
  //               ? "/user/me"
  //               : `/user/${props.userId}`
  //           )
  //         : {}
  //     }
  //     style={
  //       props.marked
  //         ? {
  //             borderWidth: props.marked ? percentToDP(0.8) : 0,
  //             borderColor: borderColor,
  //             borderRadius: percentToDP(props.size),
  //           }
  //         : {}
  //     }
  //   >
  //     {/* Loading Indicator */}
  //     {isImageLoading && (
  //       <ActivityIndicator
  //         size="medium"
  //         color={borderColor}
  //         style={{
  //           position: "relative",
  //           zIndex: 1,
  //         }}
  //       />
  //     )}
  //
  //     {/* Avatar */}
  //     <Avatar
  //       size={percentToDP(props.size)}
  //       source={
  //         avatarUrl
  //           ? { uri: avatarUrl } // Use the fetched or passed avatar URL
  //           : userPlaceholder // Fallback to placeholder image
  //       }
  //       containerStyle={[
  //         { borderRadius: percentToDP(props.size) / 2 },
  //         props.style,
  //       ]}
  //       onLoadEnd={() => setImageLoading(false)}
  //       onError={() => setImageLoading(false)}
  //     />
  //   </Pressable>
  // );
}
