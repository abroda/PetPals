import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import FriendActivityListItem from "@/components/display/FriendActivityListItem";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WalkStatsScreen() {
  const containerColor = useThemeColor("tertiary");
  const percentToPD = useWindowDimension("height");
  const heighPercentToDP = useWindowDimension("height");

  return (
    <SafeAreaView>
      <ThemedScrollView
        scrollEnabled={false}
        style={{ height: percentToPD(100) }}
      >
        <ThemedText style={{ marginTop: percentToPD(10) }}>
          TODO: Walk stats
        </ThemedText>

        <ThemedText>Friends' activity</ThemedText>
        <FlatList
          style={{
            backgroundColor: containerColor,
            height: percentToPD(30),
            padding: percentToPD(1),
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
