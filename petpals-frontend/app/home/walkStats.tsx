import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import FriendListItem from "@/components/display/ChatListItem";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function WalkStatsScreen() {
  const containerColor = useThemeColor("tertiary");
  return (
    <ThemedScrollView style={{ height: "100%" }}>
      <ThemedText style={{ marginTop: 60 }}>TODO: Walk stats</ThemedText>

      <ThemedText>Friends' activity</ThemedText>
      <FlatList
        style={{
          backgroundColor: containerColor,
          height: Dimensions.get("window").height * 0.3,
        }}
        scrollEnabled={true}
        keyExtractor={(key) => key}
        data={["abc", "def", "ghi", "jkl", "mno", "pqr", "stu"]}
        renderItem={({ item }) => <FriendListItem username={item} />}
      />
    </ThemedScrollView>
  );
}
