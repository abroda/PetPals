import { ThemedText } from "../basic/ThemedText";
import { ThemedButton } from "../inputs/ThemedButton";
import HorizontalView from "../basic/containers/HorizontalView";
import ThemedPopup from "./ThemedPopup";
import { ThemedScrollView } from "../basic/containers/ThemedScrollView";
import NotificationItem from "../display/NotificationItem";
import { Href } from "expo-router";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { Pressable } from "react-native";
import { ThemedView } from "../basic/containers/ThemedView";
import { heightPercentageToDP } from "react-native-responsive-screen";
export default function NotificationsPopup({ onDismiss = () => {} }) {
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
      <ThemedScrollView style={{ height: "85%" }}>
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
