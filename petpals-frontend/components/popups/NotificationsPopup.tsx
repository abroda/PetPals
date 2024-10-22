import { ThemedText } from "../basic/ThemedText";
import HorizontalView from "../basic/containers/HorizontalView";
import ThemedPopup from "./ThemedPopup";
import { ThemedScrollView } from "../basic/containers/ThemedScrollView";
import NotificationItem from "../display/NotificationItem";
import { Href } from "expo-router";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { Pressable } from "react-native";
import { useWindowDimension } from "@/hooks/useWindowDimension";
export default function NotificationsPopup({ onDismiss = () => {} }) {
  const percentToPD = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");

  return (
    <ThemedPopup onDismiss={onDismiss}>
      <HorizontalView>
        <ThemedText textStyleName="bigBold">Notifications</ThemedText>
        <Pressable onPress={onDismiss}>
          <ThemedIcon
            name="close"
            colorName="text"
          ></ThemedIcon>
        </Pressable>
      </HorizontalView>
      <ThemedScrollView
        style={{
          height: "85%", // TODO: figure why setting pd height obscures HorizontalView above
        }}
      >
        <NotificationItem
          notificationItem={""}
          seen={false}
          href={"/user/X" as Href<string>}
          onFollow={onDismiss}
        ></NotificationItem>
        <NotificationItem
          notificationItem={""}
          seen={false}
          href={"/user/X" as Href<string>}
          onFollow={onDismiss}
        ></NotificationItem>
        <NotificationItem
          notificationItem={""}
          seen={true}
          href={"/user/X" as Href<string>}
          onFollow={onDismiss}
        ></NotificationItem>
        <NotificationItem
          notificationItem={""}
          seen={true}
          href={"/user/X" as Href<string>}
          onFollow={onDismiss}
        ></NotificationItem>
      </ThemedScrollView>
    </ThemedPopup>
  );
}
