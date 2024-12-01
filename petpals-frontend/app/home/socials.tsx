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
  const [friendRequests, setFriendRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const backgroundColor = useThemeColor("background");
  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requests = await getFriendRequests(userId);
        setFriendRequests(requests);

        // Split into received and sent requests
        const received = requests.filter(
          (request) => request.receiverId === userId
        );
        const sent = requests.filter((request) => request.senderId === userId);

        setReceivedRequests(received);
        setSentRequests(sent);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch friend requests.");
      }
    };

    fetchRequests();
  }, [userId]);

  return (
    <SafeAreaView style={{ backgroundColor: themeColors.secondary }}>
      <ThemedView
        style={{
          alignContent: "center",
          height: heighPercentToDP(100),
          width: widthPercentageToDP(100),
          backgroundColor: themeColors.secondary,
        }}
      >
        <ThemedText
          textStyleOptions={{ size: "big", weight: "bold" }}
          style={{
            marginBottom: 20,
            backgroundColor: themeColors.secondary,
          }}
        >
          Friendship Requests
        </ThemedText>

        {/* Received Requests */}
        <ThemedText
          textStyleOptions={{ size: "medium", weight: "bold" }}
          style={{
            marginVertical: percentToDP(2),
            marginLeft: percentToDP(2),
            color: themeColors.textOnSecondary,
          }}
        >
          Received Requests
        </ThemedText>
        <View
          style={{
            width: widthPercentageToDP(90),
            flex: 1,
            paddingVertical: percentToDP(2),
            margin: "auto",
          }}
        >
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
        </View>

        {/* Sent Requests */}
        <ThemedText
          textStyleOptions={{ size: "medium", weight: "bold" }}
          style={{
            marginVertical: percentToDP(2),
            marginLeft: percentToDP(2),
            color: themeColors.textOnSecondary,
          }}
        >
          Sent Requests
        </ThemedText>
        <View
          style={{
            width: widthPercentageToDP(90),
            flex: 1,
            paddingVertical: percentToDP(2),
            margin: "auto",
          }}
        >
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
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

