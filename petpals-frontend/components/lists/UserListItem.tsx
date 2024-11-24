import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { widthPercentageToDP, heightPercentageToDP } from "react-native-responsive-screen";
import { useThemeColor } from "@/hooks/theme/useThemeColor";

type UserListItemProps = {
  id: string; // Use `id` for navigation
  username: string;
  description: string;
  imageUrl?: string;
};

const UserListItem: React.FC<UserListItemProps> = ({
                                                     id,
                                                     username,
                                                     description,
                                                     imageUrl,
                                                   }) => {
  const router = useRouter();
  const textColor = useThemeColor("textOnSecondary");

  // Navigate to the user profile using `id`
  const navigateToUserProfile = () => {
    router.push(`/user/${id}`);
  };

  return (
    <Pressable onPress={navigateToUserProfile} style={{
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      marginBottom: heightPercentageToDP(1),
      borderRadius: 10,
      backgroundColor: useThemeColor("secondary"),
      borderTopWidth: 1,
      borderColor: useThemeColor("tertiary")

    }}>
      {/* Avatar */}
      <Image
        source={imageUrl ? { uri: imageUrl } : require("@/assets/images/user_placeholder_theme-color-dark.png")}
        style={{
          width: widthPercentageToDP(15),
          height: widthPercentageToDP(15),
          borderRadius: widthPercentageToDP(100),
          marginRight: 15,
        }}
      />

      {/* User Details */}
      <View style={{
        flex: 1,
      }}>
        <Text style={{
          fontSize: widthPercentageToDP(4),
          fontWeight: "bold",
          color: useThemeColor("textOnSecondary"),
        }}>{username}</Text>
        <Text
          style={{
            fontSize: widthPercentageToDP(3),
            marginTop: 2,
            color: useThemeColor("textOnSecondary"),
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {description || "No description available"}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserListItem;


