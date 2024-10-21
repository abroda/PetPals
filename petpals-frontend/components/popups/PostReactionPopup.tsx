import { ThemedText } from "../basic/ThemedText";
import { ThemedButton } from "../inputs/ThemedButton";
import HorizontalView from "../basic/containers/HorizontalView";
import ThemedPopup from "./ThemedPopup";
export default function PostReactionPopup({ onDismiss = () => {} }) {
  return (
    <ThemedPopup
      onDismiss={onDismiss}
      style={{ width: 100, height: 50 }}
    >
      <HorizontalView>
        <ThemedText>TODO: Reactions</ThemedText>
        <ThemedButton
          label="Cancel"
          textColorName="textOnPrimary"
          style={{ width: "30%", marginBottom: "2%" }}
          onPress={onDismiss}
        />
      </HorizontalView>
    </ThemedPopup>
  );
}
