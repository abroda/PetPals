import HorizontalView from "@/components/basic/containers/HorizontalView";
import {
  ThemedView,
  ThemedViewProps,
} from "@/components/basic/containers/ThemedView";
import { ThemedText } from "@/components/basic/ThemedText";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { ThemedButton } from "../inputs/ThemedButton";
import { useState } from "react";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { Pressable } from "react-native";
import { Href, router } from "expo-router";

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

  return (
    <Pressable onPress={() => setSeen(!seen)}>
      <ThemedView
        colorName={seen ? "tertiary" : "secondary"}
        style={{ margin: "3%", padding: "3%", borderRadius: 30 }}
      >
        <HorizontalView colorName="transparent">
          <HorizontalView
            colorName="transparent"
            justifyOption="flex-start"
          >
            <ThemedView style={{ marginRight: "3%", borderRadius: 30 }}>
              <UserAvatar
                size={50}
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
          backgroundColorName="secondary"
          textStyleName="small"
          style={{ marginHorizontal: "1%", marginVertical: "3%" }}
        >
          More details details details
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}
