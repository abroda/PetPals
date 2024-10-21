import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { Href, router } from "expo-router";

export default function MyGroupWalksScreen() {
  return (
    <ThemedScrollView style={{ height: "100%", paddingTop: 50 }}>
      <ThemedText>TODO: My group walks tab</ThemedText>
      <ThemedButton
        style={{ width: "30%" }}
        label="View walk"
        onPress={() => router.push("/walk/event/xyz" as Href<string>)}
      ></ThemedButton>
      <ThemedButton
        style={{ width: "30%" }}
        label="Find walks"
        onPress={() => router.push("/walk/event/find" as Href<string>)}
      ></ThemedButton>
    </ThemedScrollView>
  );
}
