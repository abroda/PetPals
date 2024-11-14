import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import FriendActivityListItem from "@/components/display/FriendActivityListItem";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WalkStatsScreen() {
  const containerColor = useThemeColor("tertiary");
  const percentToDP = useWindowDimension("height");
  const heighPercentToDP = useWindowDimension("height");

  return (
    <SafeAreaView>
      <ThemedScrollView
        scrollEnabled={false}
        style={{ height: percentToDP(100) }}
      >
        <ThemedText style={{ marginTop: percentToDP(10) }}>
          TODO: Walk stats
        </ThemedText>

        <ThemedText>Friends' activity</ThemedText>
        <FlatList
          style={{
            backgroundColor: containerColor,
            height: percentToDP(30),
            padding: percentToDP(1),
          }}
          scrollEnabled={true}
          keyExtractor={(key) => key}
          data={["abc", "def", "ghi", "jkl", "mno", "pqr", "stu"]}
          renderItem={({ item }) => <FriendActivityListItem username={item} />}
        />
      </ThemedScrollView>
    </SafeAreaView>
  );
}
