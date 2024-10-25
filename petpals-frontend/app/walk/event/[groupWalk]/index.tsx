import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { Href, router } from "expo-router";
import Comment from "@/components/display/Comment";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";
import CommentSection from "@/components/lists/CommentSection";

export default function GroupWalkScreen() {
  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");
  return (
    <SafeAreaView>
      <ThemedScrollView
        style={{ height: heightPercentToPD(100), paddingTop: 50 }}
      >
        <ThemedText>TODO: Group walk info + comments</ThemedText>
        <ThemedButton
          style={{ width: percentToDP(30) }}
          label="Join"
          onPress={() => router.push("./join/" as Href<string>)}
        ></ThemedButton>
        <ThemedText>OR</ThemedText>
        <ThemedButton
          style={{ width: percentToDP(30) }}
          label="Edit"
          onPress={() => router.push("./edit/" as Href<string>)}
        ></ThemedButton>
        <CommentSection />
      </ThemedScrollView>
    </SafeAreaView>
  );
}
