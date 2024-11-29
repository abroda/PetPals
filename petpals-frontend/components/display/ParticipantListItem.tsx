import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { ThemedScrollView } from "../basic/containers/ThemedScrollView";
import { ThemedView, ThemedViewProps } from "../basic/containers/ThemedView";
import { ThemedText } from "../basic/ThemedText";
import { Entity } from "@/context/WalksContext";
import PetAvatar from "../navigation/PetAvatar";
import { useAuth } from "@/hooks/useAuth";
import { ViewProps } from "react-native-ui-lib";
import { FlatList } from "react-native-gesture-handler";
import HorizontalView from "../basic/containers/HorizontalView";
import UserAvatar from "../navigation/UserAvatar";

export const ParticipantListItem = (props: {
  user?: Entity;
  dogsParticipating?: Entity[];
}) => {
  const user = props.user ?? { id: "d1", name: "Example", avatarURL: "" };
  const dogsParticipating = props.dogsParticipating ?? [
    { id: "d1", name: "Cutie1", avatarURL: "" },
    { id: "d2", name: "Cutie2", avatarURL: "" },
    { id: "d3", name: "Cutie3", avatarURL: "" },
    { id: "d4", name: "Cutie4", avatarURL: "" },
    { id: "d5", name: "Cutie5", avatarURL: "" },
  ];
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
          userId={user.id}
          doLink={true}
          imageUrl={user.avatarURL}
        />
        <ThemedText
          textStyleOptions={{ weight: "semibold" }}
          style={{ marginLeft: percentToDP(2) }}
        >
          {user.name}
        </ThemedText>
      </HorizontalView>

      <HorizontalView justifyOption="flex-end">
        {dogsParticipating.map((dog) => (
          <PetAvatar
            size={12}
            userId={user.id}
            petId={dog.id}
            doLink={true}
            source={dog.avatarURL}
            viewProps={{ style: { marginLeft: percentToDP(-3.5) } }}
          />
        ))}
      </HorizontalView>
    </HorizontalView>
  );
};
