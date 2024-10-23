import HorizontalView from "@/components/basic/containers/HorizontalView";
import {
  ThemedView,
  ThemedViewProps,
} from "@/components/basic/containers/ThemedView";
import { ThemedText } from "@/components/basic/ThemedText";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { Pressable } from "react-native";
import { Href, router } from "expo-router";
import { useWindowDimension } from "@/hooks/useWindowDimension";

export default function NotificationItem(
  props: {
    notificationItem: string;
    seen: boolean;
    href: Href<string>;
    onFollow: () => void;
  } & ThemedViewProps
) {
  const { userEmail } = useAuth();
  const [seen, setSeen] = useState(props.seen);

  const percentToDP = useWindowDimension("shorter");

  return (
    <Pressable onPress={() => setSeen(!seen)}>
      <ThemedView
        colorName={seen ? "tertiary" : "secondary"}
        style={{
          margin: percentToDP(1),
          padding: percentToDP(1),
          borderRadius: percentToDP(10),
        }}
      >
        <HorizontalView colorName="transparent">
          <HorizontalView
            colorName="transparent"
            justifyOption="flex-start"
          >
            <ThemedView
              style={{
                marginRight: percentToDP(2),
                borderRadius: percentToDP(10),
              }}
            >
              <UserAvatar
                size={13}
                doLink={false}
                username={
                  (userEmail?.length ?? 0) > 0 ? userEmail ?? "me" : "me"
                }
              />
            </ThemedView>
            <ThemedText textStyleName={seen ? "default" : "defaultBold"}>
              Username did X
            </ThemedText>
          </HorizontalView>
          <ThemedIcon
            onPress={() => {
              props.onFollow();
              router.push(props.href);
            }}
            name="arrow-forward-outline"
          />
        </HorizontalView>
        <ThemedText
          backgroundColorName="transparent"
          textStyleName="small"
          style={{
            marginLeft: percentToDP(16),
            marginRight: percentToDP(2),
            marginBottom: percentToDP(3),
          }}
        >
          More details details details
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}
