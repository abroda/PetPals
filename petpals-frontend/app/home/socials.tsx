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
  const [currentTab, setCurrentTab] = useState(0);

  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const primaryColor = useThemeColor("primary");
  const linkColor = useThemeColor("link");
  const inactiveColor = useThemeColor("disabled");

  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");

  const colorScheme = useColorScheme();
  const themeColors = ThemeColors[colorScheme];


  const { getFriendRequests } = useFriendship();
  const { userId } = useAuth(); // Assuming logged-in user's ID
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requests = await getFriendRequests(userId);
        setFriendRequests(requests);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch friend requests.");
      }
    };

    fetchRequests();
  }, [userId]);


  // @ts-ignore
  return (
    <SafeAreaView style={{backgroundColor: themeColors.secondary}}>
      <ThemedView
        style={{
          alignContent: "center",
          height: heighPercentToDP(100),
          width: widthPercentageToDP(100),
          backgroundColor: themeColors.secondary
        }}
      >

        <ThemedText
          textStyleOptions={{ size: "big", weight: "bold" }}
          style={{
            marginBottom: 20,
            backgroundColor: themeColors.secondary
        }}
        >
          Friendship Requests
        </ThemedText>

        <View style={{
          // backgroundColor: 'red',
          width: widthPercentageToDP(90),
          flex: 1,
          paddingVertical: percentToDP(2),
          margin: 'auto',
        }}>
          <FlatList
            data={friendRequests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FriendRequestListItem
                requestId={item.id}
                username={item.senderUsername}
                senderId={item.senderId}
                receiverId={item.receiverId}
                avatarUrl={item.avatarUrl}
              />
            )}
          />
        </View>



        {/*<SegmentedControl*/}
        {/*  style={{*/}
        {/*    width: percentToDP(50),*/}
        {/*    alignSelf: "center",*/}
        {/*    borderColor: primaryColor,*/}
        {/*  }}*/}
        {/*  activeColor={primaryColor}*/}
        {/*  inactiveColor={inactiveColor}*/}
        {/*  activeBackgroundColor={backgroundColor}*/}
        {/*  backgroundColor={backgroundColor}*/}
        {/*  segmentsStyle={{ borderColor: primaryColor }}*/}
        {/*  onChangeIndex={(index) => setCurrentTab(index)}*/}
        {/*  segments={[*/}
        {/*    { label: "Chats" },*/}
        {/*    { label: "Friends" },*/}
        {/*    { label: "Requests" },*/}
        {/*  ]}*/}
        {/*></SegmentedControl>*/}

        {/*<FlatList*/}
        {/*  style={{ height: heighPercentToDP(40) }}*/}
        {/*  scrollEnabled={true}*/}
        {/*  keyExtractor={(key) => key}*/}
        {/*  data={[*/}
        {/*    "abc",*/}
        {/*    "def",*/}
        {/*    "ghi",*/}
        {/*    "jkl",*/}
        {/*    "mno",*/}
        {/*    "pqr",*/}
        {/*    "stu",*/}
        {/*    "vwx",*/}
        {/*    "012",*/}
        {/*    "345",*/}
        {/*    "678",*/}
        {/*    "910",*/}
        {/*  ]}*/}
        {/*  renderItem={(item) =>*/}
        {/*    currentTab == 0 ? (*/}
        {/*      <ChatListItem username={item.item} />*/}
        {/*    ) : currentTab == 1 ? (*/}
        {/*      <FriendListItem username={item.item} />*/}
        {/*    ) : (*/}
        {/*      <FriendRequestListItem username={item.item} />*/}
        {/*    )*/}
        {/*  }*/}
        {/*/>*/}
      </ThemedView>
    </SafeAreaView>
  );
}
