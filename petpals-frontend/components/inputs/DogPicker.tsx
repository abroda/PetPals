import { useWindowDimension } from "@/hooks/useWindowDimension";
import { ThemedScrollView } from "../basic/containers/ThemedScrollView";
import { ThemedView, ThemedViewProps } from "../basic/containers/ThemedView";
import { ThemedText } from "../basic/ThemedText";
import { Participant } from "@/context/WalksContext";
import PetAvatar from "../navigation/PetAvatar";
import { useAuth } from "@/hooks/useAuth";
import { ViewProps } from "react-native-ui-lib";

export const DogPicker = (
  props: ThemedViewProps & {
    header: string;
    dogs: Participant[];
    dogsParticipating: string[];
    onToggle: (dogId: string) => void;
  }
) => {
  const percentToDP = useWindowDimension("shorter");
  const { userId } = useAuth();

  return (
    <ThemedView
      style={{
        marginHorizontal: percentToDP(1.5),
        marginBottom: percentToDP(2),
      }}
      {...props}
    >
      <ThemedText
        textStyleOptions={{ weight: "semibold" }}
        style={{ marginBottom: percentToDP(2) }}
      >
        {props.header}
      </ThemedText>

      <ThemedScrollView
        horizontal
        style={{ paddingBottom: percentToDP(2) }}
      >
        {props.dogs.map((dog) => (
          <PetAvatar
            key={dog.id}
            petId={dog.id}
            petName={dog.name}
            userId={userId ?? ""}
            source={dog.avatarURL}
            size={15}
            toggleEnabled={true}
            marked={props.dogsParticipating.includes(dog.id)}
            onPress={() => props.onToggle(dog.id)}
          />
        ))}
      </ThemedScrollView>
    </ThemedView>
  );
};
