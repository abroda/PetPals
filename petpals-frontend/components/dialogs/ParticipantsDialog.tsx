import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { Participant } from "@/context/GroupWalksContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import { ParticipantListItem } from "@/components/display/ParticipantListItem";
import ThemedDialog from "@/components/dialogs/ThemedDialog";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedButton } from "@/components/inputs/ThemedButton";

export default function ParticipantsDialog(props: {
  onDismiss: () => void;
  creator: Participant;
  participantsWithDogs: Participant[];
}) {
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  return (
    <ThemedDialog>
      <SafeAreaView>
        <ThemedView
          style={{
            height: heightPercentToDP(60),
            paddingHorizontal: percentToDP(3),
            marginBottom: percentToDP(1),
          }}
        >
          <ThemedText
            textStyleOptions={{ size: "big", weight: "bold" }}
            style={{
              marginTop: percentToDP(3),
              marginBottom: percentToDP(4),
            }}
          >
            Participants
          </ThemedText>
          <FlatList
            data={[props.creator, ...props.participantsWithDogs]}
            renderItem={(row) => (
              <ParticipantListItem
                key={row.item.userId}
                user={row.item}
                isCreator={row.index === 0}
              />
            )}
            style={{
              marginBottom: percentToDP(3),
            }}
          />
          <ThemedButton
            label="Close"
            onPress={props.onDismiss}
            style={{
              marginBottom: percentToDP(3),
              width: percentToDP(50),
              alignSelf: "center",
            }}
          />
        </ThemedView>
      </SafeAreaView>
    </ThemedDialog>
  );
}
