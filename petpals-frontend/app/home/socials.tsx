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
import {useTextStyle} from "@/hooks/theme/useTextStyle";
import {assetsFonts, TextStyleConstants} from "@/constants/theme/TextStyles";



export default function FriendsScreen() {
  const { getFriendRequests, getFriends } = useFriendship();
  const { userId } = useAuth(); // Assuming logged-in user's ID

  // States
  const { receivedRequests, sentRequests, refreshRequests, friends } = useFriendship();
  const [currentTab, setCurrentTab] = useState(0);



  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];



  useEffect(() => {
    refreshRequests(); // Load requests when the screen is mounted
  }, [currentTab]);


  const renderRequestsTab = () => (
    <ThemedView backgroundColor={themeColors.secondary} style={{
      flex: 1,
      paddingVertical: widthPercentageToDP(6),
      paddingHorizontal: widthPercentageToDP(4),
    }}>
      <View style={{
        flex:1,
      }}>
        <ThemedText textStyleOptions={{size: "veryBig", weight: 'bold'}} backgroundColorName={"secondary"}>
          Received Requests
        </ThemedText>

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
              isReceiver={true}
            />
          )}
          contentContainerStyle={{
            paddingVertical: widthPercentageToDP(5),

          }}
        />
      </View>
      <View style={{
        flex:1,
        marginTop: heighPercentToDP(2),
      }}>
        <ThemedText textStyleOptions={{size: "veryBig", weight: 'bold'}} backgroundColorName={"secondary"}>Sent Requests</ThemedText>
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
              isReceiver={false}
            />
          )}
          contentContainerStyle={{
            paddingVertical: widthPercentageToDP(5),

          }}
        />
      </View>

    </ThemedView>
  )


  const renderMessagesTab = () => (
    <ThemedView
      backgroundColor={themeColors.secondary}
      style={{
        flex: 1,
        paddingVertical: widthPercentageToDP(6),
        paddingHorizontal: widthPercentageToDP(4),
      }}
    >
      <ThemedText
        textStyleOptions={{ size: "veryBig", weight: "bold" }}
        backgroundColorName={"secondary"}
      >
        Messages
      </ThemedText>
      <FlatList
        data={["Alice", "Bob", "Charlie"]} // Replace with actual chat data
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <ChatListItem username={item} />}
        contentContainerStyle={{
          paddingVertical: widthPercentageToDP(5),
        }}
      />
    </ThemedView>
  )


  const renderFriendsTab = () => (
    <ThemedView
      backgroundColor={themeColors.secondary}
      style={{
        flex: 1,
        paddingVertical: widthPercentageToDP(6),
        paddingHorizontal: widthPercentageToDP(4),
      }}
    >
      <ThemedText
        textStyleOptions={{ size: "veryBig", weight: "bold" }}
        backgroundColorName={"secondary"}
      >
        Friends
      </ThemedText>
      <FlatList
        data={friends} // Use friends from FriendshipContext
        keyExtractor={(item) => item.id} // Ensure each friend has a unique ID
        renderItem={({ item }) => (
          <FriendListItem
            username={item.username}
            description={item.description}
            userId={item.id}
          />
        )}
        contentContainerStyle={{
          paddingVertical: widthPercentageToDP(5),
        }}
        ListEmptyComponent={
          <ThemedText
            style={{
              textAlign: "center",
              marginTop: widthPercentageToDP(5),
              color: themeColors.textOnSecondary,
            }}
          >
            You have no friends yet.
          </ThemedText>
        }
      />
    </ThemedView>
  );

  const baseLabelStyle = useTextStyle({
    size: "big",
    weight: "regular",
    font: "default",
  });


  const additionalStyle = {
    backgroundColor: themeColors.transparent,

  }
  const combinedStyle={...baseLabelStyle, ...additionalStyle}
  const themePrimaryColor = useThemeColor("primary");
  const themeInactiveColor = useThemeColor("textOnSecondary");

  // Dynamic function to style each label
  const getLabelStyle = (isActive: boolean) => ({
    ...combinedStyle,
    color: isActive ? themePrimaryColor : themeInactiveColor,
  });


  // @ts-ignore
  return (
    <SafeAreaView style={{
      backgroundColor: themeColors.secondary,
      flex: 1,
    }}>
      <SegmentedControl
        segments={[
          {
            label: (
              <ThemedText style={getLabelStyle(currentTab === 0)}>
                Messages
              </ThemedText>
            ),
          },
          {
            label: (
              <ThemedText style={getLabelStyle(currentTab === 1)}>
                Requests
              </ThemedText>
            ),
          },
          {
            label: (
              <ThemedText style={getLabelStyle(currentTab === 2)}>
                Friends
              </ThemedText>
            ),
          },
        ]}
        selectedIndex={currentTab}
        onChangeIndex={(index) => setCurrentTab(index)}

        activeColor={themeColors.primary}
        inactiveColor={themeColors.textOnSecondary}
        borderRadius={percentToDP(4)}
        backgroundColor={themeColors.transparent}
        activeBackgroundColor={"transparent"} // Transparent background for active segment
        inactiveBackgroundColor={"transparent"} // Transparent background for inactive segments
        outlineWidth={0}
        style={{
          marginTop: widthPercentageToDP(5),
          marginBottom: widthPercentageToDP(2),
          width: widthPercentageToDP(50),
          backgroundColor: themeColors.primary,
          borderColor: themeColors.primary,
          borderWidth: 0,
          alignSelf: "center",
        }}
        segmentsStyle={{

        }}


      />

      {/* Tab Content */}
      {currentTab === 0 && renderMessagesTab()}
      {currentTab === 1 && renderRequestsTab()}
      {currentTab === 2 && renderFriendsTab()}

    </SafeAreaView>
  );
}