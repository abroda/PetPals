import { ThemedText } from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import UserAvatar from "@/components/navigation/UserAvatar";
import { usePathname } from "expo-router";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditUserProfileScreen() {
  const path = usePathname();
  const userId = path.slice(path.lastIndexOf("/") + 1);
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");
  return (
    <SafeAreaView>
      <ThemedView
        style={{
          height: heightPercentToPD(100),
          paddingTop: heightPercentToPD(6),
        }}
      >
        <HorizontalView justifyOption="flex-end">
          <ThemedText style={{ margin: percentToDP(4) }}>{userId}</ThemedText>
          <UserAvatar
            userId={userId}
            size={13}
            doLink={false}
          ></UserAvatar>
        </HorizontalView>
        <HorizontalView
          justifyOption="flex-start"
          style={{ paddingHorizontal: percentToDP(4) }}
        >
          <ThemedText
            style={{ marginRight: percentToDP(2) }}
            textStyleOptions={{ size: "small", weight: "bold" }}
          >
            TODO: Edit Profile
          </ThemedText>
        </HorizontalView>
      </ThemedView>
    </SafeAreaView>
  );
}
