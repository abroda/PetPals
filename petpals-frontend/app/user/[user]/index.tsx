import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import ProfileLink from "@/components/navigation/ProfileLink";
import { usePathname } from "expo-router";

export default function UserProfileScreen() {
  const path = usePathname();
  const username = path.slice(path.lastIndexOf("/") + 1);
  return (
    <ThemedView>
      <ProfileLink username={username}></ProfileLink>
      <ThemedView>
        <ThemedText>TODO:</ThemedText>
        <ThemedText>PetProfiles</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
