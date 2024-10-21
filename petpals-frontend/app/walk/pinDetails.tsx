import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { router } from "expo-router";
import { Pressable } from "react-native";

export default function PinDetailsScreen() {
  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  return (
    <ThemedScrollView style={{ height: "100%", paddingTop: 50 }}>
      <ThemedText>TODO: Pin details</ThemedText>
    </ThemedScrollView>
  );
}
