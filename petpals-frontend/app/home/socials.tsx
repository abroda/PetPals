import { Dimensions, FlatList } from "react-native";

import { ThemedView } from "@/components/basic/containers/ThemedView";

import { SegmentedControl } from "react-native-ui-lib";
import { useState } from "react";
import FriendListItem from "@/components/display/FriendListItem";
import ChatListItem from "@/components/display/ChatListItem";
import FriendRequestListItem from "@/components/display/FriendRequestListItem";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { widthPercentageToDP } from "react-native-responsive-screen";

export default function FriendsScreen() {
  const [currentTab, setCurrentTab] = useState(0);

  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const primaryColor = useThemeColor("primary");
  const linkColor = useThemeColor("link");
  const inactiveColor = useThemeColor("disabled");

  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");
  return (
    <SafeAreaView>
      <ThemedView
        style={{
          alignContent: "center",
          height: heighPercentToDP(100),
        }}
      >
        <ThemedView style={{ height: heighPercentToDP(10) }}></ThemedView>
        <SegmentedControl
          style={{
            width: percentToDP(50),
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
          style={{ height: heighPercentToDP(40) }}
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
    </SafeAreaView>
  );
}
