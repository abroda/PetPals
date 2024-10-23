import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { Href, router } from "expo-router";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FindGroupWalkScreen() {
  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");
  return (
    <SafeAreaView>
      <ThemedScrollView
        style={{ height: heightPercentToPD(100), paddingTop: 50 }}
      >
        <ThemedText>TODO: Find group walks</ThemedText>
        <ThemedButton
          style={{ width: percentToDP(34) }}
          label="View walk"
          onPress={() => router.push("/walk/event/xyz" as Href<string>)}
        ></ThemedButton>
        <ThemedButton
          style={{ width: percentToDP(34) }}
          label="Add walk"
          onPress={() => router.push("/walk/event/new" as Href<string>)}
        ></ThemedButton>
      </ThemedScrollView>
    </SafeAreaView>
  );
}
