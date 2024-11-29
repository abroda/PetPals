import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import {
  ThemedView,
  ThemedViewProps,
} from "@/components/basic/containers/ThemedView";
import { ThemedText } from "@/components/basic/ThemedText";
import { Participant } from "@/context/WalksContext";
import PetAvatar from "@/components/navigation/PetAvatar";
import { useAuth } from "@/hooks/useAuth";
import { ViewProps } from "react-native-ui-lib";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import { ParticipantListItem } from "@/components/display/ParticipantListItem";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";

export default function GroupWalkParticipantsScreen(props: {
  participantsWithDogs?: Participant[];
}) {
  const participantsWithDogs = props.participantsWithDogs ?? [];
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: "Participants" });
  }, []);

  return (
    <SafeAreaView>
      <ThemedView
        colorName="background"
        style={{
          height: heightPercentToDP(100),
          paddingTop: percentToDP(15),
          paddingBottom: percentToDP(12),
        }}
      >
        <FlatList
          data={participantsWithDogs}
          renderItem={(row) => (
            <ParticipantListItem
              user={row.item as Participant}
              dogsParticipating={row.item.dogs}
            />
          )}
          style={{
            paddingHorizontal: percentToDP(4),
            marginTop: percentToDP(5),
          }}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
