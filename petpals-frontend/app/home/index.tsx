import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import AppLogo from "@/components/decorations/static/AppLogo";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import PostFeed from "@/components/display/PostFeed";
import UserAvatar from "@/components/navigation/UserAvatar";
import NotificationsPopup from "@/components/popups/NotificationsPopup";
import { useAuth } from "@/hooks/useAuth";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { userEmail } = useAuth();
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  return (
    <SafeAreaView>
      <ThemedView style={{ height: heightPercentToDP(100) }}>
        <HorizontalView>
          <AppLogo
            size={13}
            version="horizontal"
          />
          <Pressable
            onPress={() => {
              console.log(notificationsVisible);
              setNotificationsVisible(!notificationsVisible);
            }}
          >
            <ThemedIcon
              size={percentToDP(8)}
              name="notifications"
            />
          </Pressable>
          <ThemedView style={{ margin: percentToDP(3) }}>
            <UserAvatar
              size={13}
              doLink={true}
              username={(userEmail?.length ?? 0) > 0 ? userEmail ?? "me" : "me"}
            />
          </ThemedView>
        </HorizontalView>
        {notificationsVisible && (
          <NotificationsPopup
            onDismiss={() => setNotificationsVisible(false)}
          />
        )}

        <PostFeed username="Dominika_Xyz"></PostFeed>
      </ThemedView>
    </SafeAreaView>
  );
}
