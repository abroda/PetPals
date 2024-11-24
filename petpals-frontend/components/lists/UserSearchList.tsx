import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import UserListItem from "./UserListItem";
import {UserProfile} from "@/context/UserContext";
import { ColorName, ThemedColor, useThemeColor } from "@/hooks/theme/useThemeColor";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { widthPercentageToDP, heightPercentageToDP } from "react-native-responsive-screen";
import {ThemeColors} from "@/constants/theme/Colors";
import {number} from "prop-types";

type UserSearchListProps = {
  users: UserProfile[];
};

const primaryColor = useThemeColor("primary");
const secondaryColor = useThemeColor("secondary");
const tertiaryColor = useThemeColor("tertiary");
const textOnSecondaryColor = useThemeColor("textOnSecondary");

const UserSearchList: React.FC<UserSearchListProps> = ({ users}) => {
  if (users.length === 0) {
    return (
      <View style={{}}>
        <Text style={{}}>No users found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <UserListItem
          id={item.id} // Pass `id` to the list item
          username={item.username}
          description={item.description}
          imageUrl={item.imageUrl}
        />
      )}
      style={{height: heightPercentageToDP(100),}}
    />
  );
};

export default UserSearchList;


