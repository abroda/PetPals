import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const path = usePathname();
  const userId = path.slice(path.lastIndexOf("/") + 1);
  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");

  return (
    <SafeAreaView>
      <ThemedScrollView
        style={{ height: heighPercentToDP(100), paddingTop: percentToDP(10) }}
      >
        <HorizontalView justifyOption="flex-end">
          <ThemedText>{userId}</ThemedText>
          <UserAvatar
            userId={userId}
            size={15}
            doLink={true}
          ></UserAvatar>
        </HorizontalView>
        <ThemedText style={{ marginTop: percentToDP(10) }}>
          TODO: Chat with user
        </ThemedText>
      </ThemedScrollView>
    </SafeAreaView>
  );
}
