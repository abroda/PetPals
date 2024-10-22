import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { Href, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyGroupWalksScreen() {
  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");
  return (
    <SafeAreaView>
      <ThemedScrollView
        style={{ height: heighPercentToDP(100), paddingTop: percentToDP(10) }}
      >
        <ThemedText>TODO: My group walks tab</ThemedText>
        <ThemedButton
          style={{ width: percentToDP(35) }}
          label="View walk"
          onPress={() => router.push("/walk/event/xyz" as Href<string>)}
        ></ThemedButton>
        <ThemedButton
          style={{ width: percentToDP(35) }}
          label="Find walks"
          onPress={() => router.push("/walk/event/find" as Href<string>)}
        ></ThemedButton>
      </ThemedScrollView>
    </SafeAreaView>
  );
}
