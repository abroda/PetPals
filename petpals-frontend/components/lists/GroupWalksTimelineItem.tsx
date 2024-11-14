import { ThemedView } from "@/components/basic/containers/ThemedView";

import { useState } from "react";
import { ThemedText } from "../basic/ThemedText";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { GroupWalk } from "@/context/WalksContext";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { FlatList } from "react-native-gesture-handler";
import GroupWalkListItem from "../display/GroupWalkListItem";
import { ThemedScrollView } from "../basic/containers/ThemedScrollView";
import { format } from "date-fns";

export default function GroupWalksTimelineItem({
  date,
  groupWalks,
  today,
}: {
  date: Date;
  groupWalks: GroupWalk[];
  today?: Date;
}) {
  const percentToDP = useWindowDimension("shorter");
  const heightpercentToDP = useWindowDimension("height");

  const getDateHeader = () => {
    let header = "";
    if (today) {
      header =
        format(today, "dd.MM.yyyy") === format(date, "dd.MM.yyyy")
          ? "Today"
          : format(date, "EEEE");

      header += " | ";
    }

    return header + format(date, today ? "dd.MM" : "dd.MM.yyyy");
  };

  return (
    <ThemedView colorName="transparent">
      <ThemedText
        style={{
          marginTop: percentToDP(-4),
          marginLeft: percentToDP(1),
          marginBottom: percentToDP(3),
        }}
      >
        {getDateHeader()}
      </ThemedText>
      {groupWalks.length == 0 && (
        <ThemedText
          style={{
            marginBottom: heightpercentToDP(8),
          }}
        >
          No plans yet.
        </ThemedText>
      )}
      {groupWalks.map((walk) => (
        <GroupWalkListItem
          key={walk.id}
          groupWalk={walk}
        />
      ))}
    </ThemedView>
  );
}
