import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import PetAvatar from "@/components/navigation/PetAvatar";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { Href, router } from "expo-router";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecordWalkScreen() {
  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");
  return (
    <SafeAreaView>
      <ThemedScrollView
        style={{ height: heightPercentToPD(100), paddingTop: 50 }}
      >
        <ThemedText>TODO: Record a walk</ThemedText>
        <ThemedText>Clickable on Map:</ThemedText>
        <ThemedText>Pins</ThemedText>
        <Pressable
          onPress={() => router.push("/walk/pins/pinID" as Href<string>)}
        >
          <ThemedIcon
            name="location"
            colorName="alarm"
            size={40}
          ></ThemedIcon>
        </Pressable>
        <ThemedText textStyleName="bigBold">TODO</ThemedText>
        <ThemedText>Visible users</ThemedText>
        <UserAvatar
          size={13}
          username={"OtherUser"}
          doLink={true}
        />
        <ThemedText>Ongoing group walk</ThemedText>
        <Pressable onPress={() => router.push("/walk/event/xyz")}>
          <ThemedIcon
            name="people-circle"
            size={40}
          ></ThemedIcon>
        </Pressable>
        <ThemedText>My pets (choose which)</ThemedText>
        <PetAvatar
          size={11}
          username={"me"}
          pet="Cutie"
          doLink={true}
        />
      </ThemedScrollView>
    </SafeAreaView>
  );
}
