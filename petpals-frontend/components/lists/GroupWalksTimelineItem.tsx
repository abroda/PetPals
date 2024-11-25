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
  thisWeek,
  markJoined,
  markCreated,
}: {
  date?: Date;
  groupWalks: GroupWalk[];
  today: Date;
  thisWeek?: boolean;
  markJoined?: boolean;
  markCreated?: boolean;
}) {
  const percentToDP = useWindowDimension("shorter");
  const heightpercentToDP = useWindowDimension("height");

  const getDateHeader = () => {
    let header = "";

    if (date) {
      if (format(today, "dd.MM.yyyy") === format(date, "dd.MM.yyyy")) {
        header = "Today | ";
      } else if (thisWeek) {
        header = format(date, "EEEE | ");
      }

      header += date.toLocaleDateString(undefined, {
        dateStyle: "short",
      });
    } else {
      header = "No plans yet";
    }

    return header;
  };

  return (
    <ThemedView
      colorName="transparent"
      style={{ marginBottom: heightpercentToDP(2) }}
    >
      <ThemedText
        style={{
          marginTop: percentToDP(-4),
          marginLeft: percentToDP(1),
          marginBottom: percentToDP(3),
        }}
      >
        {getDateHeader()}
      </ThemedText>
      {groupWalks.length == 0 && date && (
        <ThemedText
          style={{
            marginBottom: heightpercentToDP(3),
          }}
        >
          No plans yet.
        </ThemedText>
      )}
      {groupWalks.map((walk) => (
        <GroupWalkListItem
          key={walk.id}
          groupWalk={walk}
          markJoined={markJoined}
          markCreated={markCreated}
        />
      ))}
    </ThemedView>
  );
}
