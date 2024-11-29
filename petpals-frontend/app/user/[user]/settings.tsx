import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppSettings() {
  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");
  return (
    <SafeAreaView>
      <ThemedScrollView style={{ height: heighPercentToDP(100) }}>
        <ThemedText style={{ marginTop: percentToDP(10) }}>
          TODO: App settings
        </ThemedText>
      </ThemedScrollView>
    </SafeAreaView>
  );
}
