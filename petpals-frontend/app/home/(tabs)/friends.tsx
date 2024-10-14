import { FlatList } from "react-native";

import { ThemedView } from "@/components/basic/containers/ThemedView";
import FriendListItem from "@/components/lists/FriendListItem";

export default function FriendsScreen() {
  return (
    <ThemedView>
      <FlatList
        data={["abc", "def", "ghi", "jkl", "mno", "pqr", "stu", "vwx"]}
        renderItem={({ item }) => <FriendListItem username={item} />}
      />
    </ThemedView>
  );
}
