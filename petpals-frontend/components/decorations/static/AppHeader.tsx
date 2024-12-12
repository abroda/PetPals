import HorizontalView from "@/components/basic/containers/HorizontalView";
import AppLogo from "@/components/decorations/static/AppLogo";
import {Pressable, View} from "react-native";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";
import {ThemedView} from "@/components/basic/containers/ThemedView";
import UserAvatar from "@/components/navigation/UserAvatar";
import {useWindowDimension} from "@/hooks/theme/useWindowDimension";
import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {ThemeColors} from "@/constants/theme/Colors";
import React from "react";
import {useUser} from "@/hooks/useUser";
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import {ColorName, ThemedColor} from "@/hooks/theme/useThemeColor";

export default function AppHeader(props: {
  backgroundColorName: ColorName,
}) {

  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];

  const [notificationsVisible, setNotificationsVisible] = React.useState(false);
  const {userProfile} = useUser();

  return (
    <HorizontalView
      colorName={props.backgroundColorName}
      style={{
        width: widthPercentageToDP(100),
        paddingHorizontal: percentToDP(5),
        paddingVertical: percentToDP(3),
    }}>

      <View style={{
        flex: 1,
      }}>
        {/* APP LOGO */}
        <AppLogo
          size={10}
          version="horizontal"
          backgroundColorName={props.backgroundColorName}

        />
      </View>


      {/* NOTIFICATIONS ICON */}
      {/*<Pressable*/}
      {/*  style={{*/}
      {/*    marginRight: percentToDP(3),*/}
      {/*  }}*/}
      {/*  onPress={() => {*/}
      {/*    console.log(notificationsVisible);*/}
      {/*    setNotificationsVisible(!notificationsVisible);*/}
      {/*  }}>*/}
      {/*  <ThemedIcon*/}
      {/*    size={percentToDP(6)}*/}
      {/*    name="notifications"*/}
      {/*  />*/}
      {/*</Pressable>*/}

      <UserAvatar
        size={10}
        doLink={true}
        userId={"me"}
        imageUrl={userProfile?.imageUrl}
        style={{
          margin: 0,

        }}
      />


    </HorizontalView>
  );
}