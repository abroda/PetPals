import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import PetAvatar from "@/components/navigation/PetAvatar";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { Href, router } from "expo-router";

export default function RecordWalkScreen() {
  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  return (
    <ThemedScrollView style={{ height: "100%", paddingTop: 50 }}>
      <ThemedText>TODO: Record a walk</ThemedText>
      <ThemedText>Clickable on Map:</ThemedText>
      <ThemedText>Pins</ThemedText>
      <ThemedButton
        style={{ width: "30%" }}
        label="TODO: Pin"
        onPress={() => router.push("/walk/pinDetails" as Href<string>)}
      ></ThemedButton>
      <ThemedText textStyleName="bigBold">TODO</ThemedText>
      <ThemedText>Visible users</ThemedText>
      <UserAvatar
        size={50}
        username={"OtherUser"}
        doLink={true}
      />
      <ThemedText>Ongoing group walk</ThemedText>
      <ThemedButton
        style={{ width: "30%" }}
        label="TODO: Group walk icon"
        onPress={() => router.push("/walk/event/xyz")}
      ></ThemedButton>
      <ThemedText>My pets (choose which)</ThemedText>
      <PetAvatar
        size={40}
        username={"me"}
        pet="Cutie"
        doLink={true}
      />
    </ThemedScrollView>
  );
}
