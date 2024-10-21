import { Dimensions, FlatList } from "react-native";

import { ThemedView } from "@/components/basic/containers/ThemedView";

import { SegmentedControl } from "react-native-ui-lib";
import { useState } from "react";
import FriendListItem from "@/components/display/FriendListItem";
import ChatListItem from "@/components/display/ChatListItem";
import FriendRequestListItem from "@/components/display/FriendRequestListItem";
import { useThemeColor } from "@/hooks/theme/useThemeColor";

export default function FriendsScreen() {
  const [currentTab, setCurrentTab] = useState(0);

  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const primaryColor = useThemeColor("primary");
  const linkColor = useThemeColor("link");
  const inactiveColor = useThemeColor("disabled");

  return (
    <ThemedView
      style={{
        alignContent: "center",
        height: "100%",
      }}
    >
      <ThemedView style={{ height: 20 }}></ThemedView>
      <SegmentedControl
        style={{
          width: "50%",
          alignSelf: "center",
          borderColor: primaryColor,
        }}
        activeColor={primaryColor}
        inactiveColor={inactiveColor}
        activeBackgroundColor={backgroundColor}
        backgroundColor={backgroundColor}
        segmentsStyle={{ borderColor: primaryColor }}
        onChangeIndex={(index) => setCurrentTab(index)}
        segments={[
          { label: "Chats" },
          { label: "Friends" },
          { label: "Requests" },
        ]}
      ></SegmentedControl>
      <FlatList
        style={{ height: Dimensions.get("window").height * 0.4 }}
        scrollEnabled={true}
        keyExtractor={(key) => key}
        data={[
          "abc",
          "def",
          "ghi",
          "jkl",
          "mno",
          "pqr",
          "stu",
          "vwx",
          "012",
          "345",
          "678",
          "910",
        ]}
        renderItem={(item) =>
          currentTab == 0 ? (
            <ChatListItem username={item.item} />
          ) : currentTab == 1 ? (
            <FriendListItem username={item.item} />
          ) : (
            <FriendRequestListItem username={item.item} />
          )
        }
      />
    </ThemedView>
  );
}
