import { ThemedText } from "../basic/ThemedText";
import { ThemedButton } from "../inputs/ThemedButton";
import HorizontalView from "../basic/containers/HorizontalView";
import ThemedPopup from "./ThemedPopup";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { ThemedView } from "../basic/containers/ThemedView";
export default function PostReactionPopup({ onDismiss = () => {} }) {
  const percentToDP = useWindowDimension("shorter");
  return (
    <ThemedPopup
      onDismiss={onDismiss}
      style={{ width: 100, height: 50 }}
      innerShape={(children) => (
        <ThemedView
          style={{
            width: percentToDP(92),
            height: percentToDP(25),
            margin: percentToDP(4),
            padding: percentToDP(4),
            paddingBottom: percentToDP(1),
            borderRadius: percentToDP(10),
          }}
          children={children}
        />
      )}
    >
      <HorizontalView>
        <ThemedText style={{ paddingBottom: percentToDP(3.5) }}>
          TODO: Reactions
        </ThemedText>
        <ThemedButton
          label="Cancel"
          textColorName="textOnPrimary"
          style={{ width: percentToDP(30), marginBottom: percentToDP(2) }}
          onPress={onDismiss}
        />
      </HorizontalView>
    </ThemedPopup>
  );
}
