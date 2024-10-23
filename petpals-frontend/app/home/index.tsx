import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import AppLogo from "@/components/decorations/static/AppLogo";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import PostFeed from "@/components/lists/PostFeed";
import UserAvatar from "@/components/navigation/UserAvatar";
import NotificationsPopup from "@/components/popups/NotificationsPopup";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Pressable } from "react-native";

export default function HomeScreen() {
  const { userId } = useAuth();
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  return (
    <ThemedView>
      <HorizontalView>
        <AppLogo
          size={9}
          version="horizontal"
        />
        <Pressable
          onPress={() => {
            console.log(notificationsVisible);
            setNotificationsVisible(!notificationsVisible);
          }}
        >
          <ThemedIcon name="notifications" />
        </Pressable>
        <ThemedView style={{ margin: "3%" }}>
          <UserAvatar
            size={50}
            doLink={true}
            userId={(userId?.length ?? 0) > 0 ? userId ?? "me" : "me"}
          />
        </ThemedView>
      </HorizontalView>
      {notificationsVisible && (
        <NotificationsPopup onDismiss={() => setNotificationsVisible(false)} />
      )}

      <PostFeed></PostFeed>

    </ThemedView>
  );
}
