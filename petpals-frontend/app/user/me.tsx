import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import ProfileLink from "@/components/navigation/ProfileLink";
import { router, usePathname } from "expo-router";

export default function UserProfileScreen() {
  const path = usePathname();
  const username = path.slice(path.lastIndexOf("/") + 1);
  return (
    <ThemedView>
      <ProfileLink username={username}></ProfileLink>
      <ThemedView>
        <ThemedText>TODO:</ThemedText>
        <ThemedText>PetProfiles</ThemedText>
        <ThemedButton
          onPress={() => {
            router.dismissAll();
            router.push("/logout");
          }}
        >
          Logout
        </ThemedButton>
      </ThemedView>
    </ThemedView>
  );
}
