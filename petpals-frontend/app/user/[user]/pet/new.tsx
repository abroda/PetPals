import { ThemedText } from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import UserAvatar from "@/components/navigation/UserAvatar";
import { router, usePathname } from "expo-router";
import { Image } from "react-native-ui-lib";

export default function NewPetProfileScreen() {
  const path = usePathname();
  const username = path.split("/")[2];
  const pet = path.slice(path.lastIndexOf("/") + 1);
  return (
    <ThemedView style={{ height: "100%", paddingTop: 30 }}>
      <HorizontalView justifyOption="flex-end">
        <ThemedText style={{ margin: 10 }}>Owner:</ThemedText>
        <ThemedText>{username}</ThemedText>
        <UserAvatar
          username={username}
          size={50}
          doLink={true}
        ></UserAvatar>
      </HorizontalView>
      <ThemedView>
        <ThemedText>Pet: {pet}</ThemedText>
        <ThemedText>TODO: Add PetProfile</ThemedText>
      </ThemedView>
      <Image
        source={{
          uri: "https://www.coalitionrc.com/wp-content/uploads/2017/01/placeholder.jpg",
        }}
        style={{
          width: "100%",
          height: "80%",
        }}
      />
      <ThemedButton
        style={{ width: "30%" }}
        onPress={() => router.replace("./newPetName")}
      >
        Save
      </ThemedButton>
    </ThemedView>
  );
}
