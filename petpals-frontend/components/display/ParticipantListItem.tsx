import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { ThemedText } from "../basic/ThemedText";
import { Participant } from "@/context/GroupWalksContext";
import PetAvatar from "../navigation/PetAvatar";
import { useAuth } from "@/hooks/useAuth";
import HorizontalView from "../basic/containers/HorizontalView";
import UserAvatar from "../navigation/UserAvatar";
import { useThemeColor } from "@/hooks/theme/useThemeColor";

export const ParticipantListItem = (props: {
  user: Participant;
  isCreator: boolean;
}) => {
  const user = props.user ?? { id: "d1", name: "Example", avatarURL: "" };
  const dogsParticipating = props.user.dogs ?? [];

  const borderColor = useThemeColor("primary");
  const percentToDP = useWindowDimension("shorter");
  const { userId } = useAuth();

  return (
    <HorizontalView
      justifyOption="space-between"
      style={{ marginBottom: percentToDP(3) }}
    >
      <HorizontalView justifyOption="flex-start">
        <UserAvatar
          size={12}
          userId={user.userId}
          doLink={true}
          imageUrl={user.imageURL}
          marked={props.isCreator}
        />
        <ThemedText
          textStyleOptions={{ weight: "semibold" }}
          style={{ marginLeft: percentToDP(2) }}
        >
          {user.username}
        </ThemedText>
      </HorizontalView>

      <HorizontalView justifyOption="flex-end">
        {dogsParticipating.map((dog) => (
          <PetAvatar
            key={dog.dogId}
            size={12}
            userId={user.userId}
            petId={dog.dogId}
            doLink={true}
            source={dog.imageUrl}
            viewProps={{ style: { marginLeft: percentToDP(-3.5) } }}
          />
        ))}
      </HorizontalView>
    </HorizontalView>
  );
};
