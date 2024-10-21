import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { router } from "expo-router";
import { Pressable } from "react-native";

export default function ActiveWalkScreen() {
  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  return (
    <ThemedScrollView style={{ height: "100%", paddingTop: 50 }}>
      <Pressable
        onPress={() => router.push("/walk/record")}
        style={{
          backgroundColor: buttonColor,
          width: 60,
          height: 60,
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
        }}
      >
        <ThemedIcon
          colorName="text"
          name={"play"}
        ></ThemedIcon>
      </Pressable>
    </ThemedScrollView>
  );
}
