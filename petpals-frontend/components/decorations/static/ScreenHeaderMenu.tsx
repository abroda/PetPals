import React, { useState } from "react";
import {
  View,
  Pressable,
  Alert,
  Text,
} from "react-native";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { useColorScheme } from "@/hooks/theme/useColorScheme";
import { ThemeColors } from "@/constants/theme/Colors";
import { widthPercentageToDP, heightPercentageToDP } from "react-native-responsive-screen";
import {useAuth} from "@/hooks/useAuth";

interface HeaderRightMenuProps {
  isOwnProfile: boolean;
  menuOptions: Array<{ label: string; onPress: () => void }>; // Dynamic menu options
}

export const ScreenHeaderMenu: React.FC<HeaderRightMenuProps> = ({
                                                                  isOwnProfile = true,
                                                                  menuOptions,
                                                                }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const {userId} = useAuth()

  // Styling
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];

  return (
    <View
      style={{

      marginLeft: 'auto',
      marginRight: percentToDP(0),
      marginVertical: heightPercentageToDP(1),
    }}>
      {/* Header Icons */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: themeColors.tertiary,
          padding: percentToDP(1),
          borderRadius: 100,
        }}
      >
        {/* Notifications Button */}
        {/* Three-dots Menu */}
        {isOwnProfile && (
          <Pressable onPress={() => setMenuVisible(!menuVisible)} style={{
            padding: percentToDP(2),
            zIndex: 999,
          }}>
            <ThemedIcon
              name="ellipsis-vertical-outline"
              style={{
                marginHorizontal: widthPercentageToDP(1),

              }}
            />
          </Pressable>
        )}

        <Pressable onPressIn={() => alert("Notification")} style={{
          zIndex: 999,
        }}>
          <ThemedIcon
            name="notifications-outline"
            style={{
              marginHorizontal: widthPercentageToDP(1),
              padding: percentToDP(2),
            }}
            color={themeColors.primary}
          />
        </Pressable>


        {/* User Avatar */}
        <UserAvatar
          userId={userId || ""}
          size={10}
          doLink={true}
        />


      </View>

      {/* Dropdown Menu */}
      {menuVisible && (
        <>


          {/* Menu Options */}
          <View
            style={{
              position: "absolute",
              zIndex: 9999,
              elevation: 10,
              top: heightPercentageToDP(10),
              right: widthPercentageToDP(5),
              width: widthPercentageToDP(40),
              backgroundColor: themeColors.tertiary,
              borderRadius: 10,
              shadowOpacity: 0.3,
              shadowRadius: 10,
              borderWidth: 1,
              borderColor: themeColors.primary,
              alignItems: "center",
            }}
          >
            {menuOptions.map((option, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  setMenuVisible(false);
                  option.onPress();
                }}
              >
                <Text
                  style={{
                    padding: 15,
                    color: themeColors.primary,
                    borderBottomWidth: index < menuOptions.length - 1 ? 1 : 0,
                    borderColor: themeColors.primary,
                    fontSize: 16,
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </View>
  );
};


// Should be put into [user]/index like this
// <ScreenHeaderMenu
//   avatarUrl={userProfile?.imageUrl}
//   isOwnProfile={true}
//   menuOptions={[
//     { label: "Edit Profile", onPress: () => router.push("/user/me/editProfile") },
//     { label: "App Settings", onPress: () => router.push("/settings") },
//   ]}
// />