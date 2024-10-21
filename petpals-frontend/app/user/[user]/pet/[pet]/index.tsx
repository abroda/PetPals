import { ThemedText } from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import UserAvatar from "@/components/navigation/UserAvatar";
import { usePathname } from "expo-router";
import { Image } from "react-native-ui-lib";

export default function PetProfileScreen() {
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
        <ThemedText>TODO: PetProfile</ThemedText>
      </ThemedView>
      <Image
        source={{
          uri: "http://images2.fanpop.com/image/photos/13800000/Cute-Dogs-dogs-13883179-2560-1931.jpg",
        }}
        style={{
          width: "100%",
          height: "80%",
        }}
      />
    </ThemedView>
  );
}
