import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import UserAvatar from "@/components/navigation/UserAvatar";
import { usePathname } from "expo-router";

export default function ChatScreen() {
  const path = usePathname();
  const username = path.slice(path.lastIndexOf("/") + 1);

  return (
    <ThemedScrollView style={{ height: "100%", paddingTop: 50 }}>
      <HorizontalView justifyOption="flex-end">
        <ThemedText>{username}</ThemedText>
        <UserAvatar
          username={username}
          size={50}
          doLink={true}
        ></UserAvatar>
      </HorizontalView>
      <ThemedText style={{ marginTop: 60 }}>TODO: Chat with user</ThemedText>
    </ThemedScrollView>
  );
}
