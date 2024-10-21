import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { Href, router } from "expo-router";
import { Pressable } from "react-native";

export default function FindGroupWalkScreen() {
  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  return (
    <ThemedScrollView style={{ height: "100%", paddingTop: 50 }}>
      <ThemedText>TODO: Find group walks</ThemedText>
      <ThemedButton
        style={{ width: "30%" }}
        label="View walk"
        onPress={() => router.push("/walk/event/xyz" as Href<string>)}
      ></ThemedButton>
      <ThemedButton
        style={{ width: "30%" }}
        label="Add walk"
        onPress={() => router.push("/walk/event/new" as Href<string>)}
      ></ThemedButton>
    </ThemedScrollView>
  );
}
