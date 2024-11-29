import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { router } from "expo-router";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PinDetailsScreen() {
  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");
  return (
    <SafeAreaView>
      <ThemedScrollView
        style={{ height: heightPercentToDP(100), paddingTop: 50 }}
      >
        <ThemedText>TODO: Pin details</ThemedText>
      </ThemedScrollView>
    </SafeAreaView>
  );
}
