import {Alert, Dimensions, FlatList, View} from "react-native";

import { ThemedView } from "@/components/basic/containers/ThemedView";

import { SegmentedControl } from "react-native-ui-lib";
import {useEffect, useState} from "react";
import FriendListItem from "@/components/display/FriendListItem";
import ChatListItem from "@/components/display/ChatListItem";
import FriendRequestListItem from "@/components/display/FriendRequestListItem";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { widthPercentageToDP } from "react-native-responsive-screen";

import {FriendshipRequest, useFriendship} from "@/context/FriendshipContext";
import {useAuth} from "@/hooks/useAuth";
import {ThemedText} from "@/components/basic/ThemedText";

import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {ThemeColors} from "@/constants/theme/Colors";


export default function FriendsScreen() {
  const { getFriendRequests } = useFriendship();
  const { userId } = useAuth(); // Assuming logged-in user's ID

  // States
  const { receivedRequests, sentRequests, refreshRequests } = useFriendship();

  const backgroundColor = useThemeColor("background");
  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];

  useEffect(() => {
    refreshRequests(); // Load requests when the screen is mounted
  }, []);

  return (
    <SafeAreaView>
      <ThemedText>Received Requests</ThemedText>
      <FlatList
        data={receivedRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FriendRequestListItem
            requestId={item.id}
            username={item.senderUsername}
            senderId={item.senderId}
            receiverId={item.receiverId}
            avatar={item.senderId}
          />
        )}
      />
      <ThemedText>Sent Requests</ThemedText>
      <FlatList
        data={sentRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FriendRequestListItem
            requestId={item.id}
            username={item.receiverUsername}
            senderId={item.senderId}
            receiverId={item.receiverId}
            avatar={item.receiverId}
          />
        )}
      />
    </SafeAreaView>
  );
}