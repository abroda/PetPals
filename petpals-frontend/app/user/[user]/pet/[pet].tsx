import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import ProfileLink from "@/components/navigation/ProfileLink";
import { usePathname } from "expo-router";

export default function PetProfileScreen() {
  const path = usePathname();
  const username = path.split("/")[-3];
  const pet = path.slice(path.lastIndexOf("/") + 1);
  return (
    <ThemedView>
      <ProfileLink username={username}></ProfileLink>
      <ThemedView>
        <ThemedText>{pet}</ThemedText>
        <ThemedText>TODO: PetProfile</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
