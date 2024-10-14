import { ThemedView } from "@/components/basic/containers/ThemedView";
import ProfileLink from "@/components/navigation/ProfileLink";
import { useAuth } from "@/hooks/useAuth";

export default function HomeScreen() {
  const { userEmail } = useAuth();
  return (
    <ThemedView>
      <ProfileLink username={userEmail ?? "-"}></ProfileLink>
    </ThemedView>
  );
}
