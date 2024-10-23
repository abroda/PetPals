import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { router } from "expo-router";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActiveWalkScreen() {
  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");
  return (
    <SafeAreaView>
      <ThemedScrollView
        style={{ height: heighPercentToDP(100), paddingTop: percentToDP(10) }}
      >
        <Pressable
          onPress={() => router.push("/walk/record")}
          style={{
            backgroundColor: buttonColor,
            width: percentToDP(15),
            height: percentToDP(15),
            borderRadius: percentToDP(10),
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
    </SafeAreaView>
  );
}
