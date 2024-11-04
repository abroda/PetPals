import { Pressable } from "react-native";

import { ThemedView } from "@/components/basic/containers/ThemedView";

import { useState } from "react";
import { Href, router } from "expo-router";
import { ThemedText } from "../basic/ThemedText";
import HorizontalView from "../basic/containers/HorizontalView";
import UserAvatar from "../navigation/UserAvatar";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { GroupWalk } from "@/context/WalksContext";
import { Card, View } from "react-native-ui-lib";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { Tag } from "./Tag";
import { format } from "date-fns";

export default function GroupWalkListItem({
  groupWalk,
}: {
  groupWalk: GroupWalk;
}) {
  const [selected, setSelected] = useState("");
  const percentToPD = useWindowDimension("shorter");
  const heightpercentToPD = useWindowDimension("height");
  const backgroundColor = useThemeColor("text") + "16";

  // TODO: fix when backend works
  const getWalkId = () => {
    return groupWalk.id;
  };

  const getTitle = () => {
    return groupWalk.title;
  };

  const getHour = () => {
    return format(groupWalk.datetime, "HH:mm");
  };

  const getLocation = () => {
    return groupWalk.location;
  };

  const getParticipantsCount = () => {
    return groupWalk.participantsCount;
  };

  return (
    <Card
      backgroundColor={backgroundColor}
      borderRadius={percentToPD(10)}
      enableShadow={false}
      style={{
        paddingHorizontal: percentToPD(4.7),
        paddingVertical: percentToPD(3.7),
        marginBottom: percentToPD(2.5),
      }}
      onPress={() => router.push(`/walk/event/${getWalkId()}` as Href<string>)}
    >
      {/* SHORT INFO */}
      <HorizontalView colorName="transparent">
        {/* LEFT-SIDE TEXT */}
        <ThemedView
          colorName="transparent"
          style={{
            flex: 1,
          }}
        >
          {/* TITLE */}
          <ThemedText
            textStyleOptions={{ weight: "bold" }}
            backgroundColorName="transparent"
            numberOfLines={3}
          >
            {getTitle()}
          </ThemedText>
          {/* DIVIDER */}
          <ThemedView
            colorName="primary"
            style={{
              height: percentToPD(1),
              borderRadius: percentToPD(10),
              marginTop: percentToPD(2),
              marginBottom: percentToPD(3),
            }}
          />
          {/* UNDER DIVIDER */}
          <HorizontalView
            justifyOption="space-between"
            colorName="transparent"
            style={{ marginBottom: percentToPD(5) }}
          >
            {/* LOCATION */}
            <HorizontalView
              justifyOption="flex-start"
              colorName="transparent"
            >
              <ThemedIcon
                size={22}
                style={{ marginLeft: percentToPD(-0.7) }}
                name="location"
              />
              <ThemedText
                textStyleOptions={{ size: "small" }}
                backgroundColorName="transparent"
                numberOfLines={1}
                style={{
                  paddingLeft: percentToPD(1),
                  paddingRight: percentToPD(2),
                }}
              >
                {getLocation()}
              </ThemedText>
            </HorizontalView>
            {/* NO. OF PARTICIPANTS */}
            <HorizontalView
              justifyOption="flex-end"
              colorName="transparent"
              style={{
                width: percentToPD(14),
                flex: 0,
              }}
            >
              <ThemedIcon
                size={20.5}
                name="person"
              />
              <ThemedText
                textStyleOptions={{ size: "small" }}
                backgroundColorName="transparent"
                style={{ paddingLeft: percentToPD(1) }}
              >
                {getParticipantsCount()}
              </ThemedText>
            </HorizontalView>
          </HorizontalView>
        </ThemedView>
        {/* HOUR */}
        <ThemedText
          backgroundColorName="transparent"
          style={{
            justifyContent: "flex-end",
            alignContent: "flex-end",
            alignSelf: "flex-end",
            marginBottom: percentToPD(11.7),
            paddingLeft: percentToPD(4),
          }}
        >
          {getHour()}
        </ThemedText>
      </HorizontalView>
      {/* TAGS */}
      <HorizontalView
        justifyOption="flex-start"
        colorName="transparent"
        style={{
          flexWrap: "wrap",
          marginRight: percentToPD(-1),
        }}
      >
        {groupWalk.tags.map((tag) => (
          <Tag
            key={tag}
            label={tag}
          />
        ))}
      </HorizontalView>
    </Card>
  );
}
