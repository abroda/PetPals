import { ThemedText } from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { router, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native-ui-lib";

export default function NewPetProfileScreen() {
  const path = usePathname();
  const username = path.split("/")[2];
  const pet = path.slice(path.lastIndexOf("/") + 1);

  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");
  return (
    <SafeAreaView>
      <ThemedView
        style={{
          height: heightPercentToDP(100),
          paddingTop: percentToDP(10),
          paddingBottom: percentToDP(10),
        }}
      >
        <HorizontalView justifyOption="flex-end">
          <ThemedText style={{ margin: percentToDP(4) }}>Owner:</ThemedText>
          <ThemedText>{username}</ThemedText>
          <UserAvatar
            username={username}
            size={13}
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
            width: percentToDP(100),
            height: percentToDP(100),
          }}
        />
        <ThemedButton
          style={{ width: percentToDP(30) }}
          onPress={() => router.replace("./newPetName")}
          label="Save"
        ></ThemedButton>
      </ThemedView>
    </SafeAreaView>
  );
}
