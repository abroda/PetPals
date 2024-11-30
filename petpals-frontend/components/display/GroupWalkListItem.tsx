import { Pressable } from "react-native";

import { ThemedView } from "@/components/basic/containers/ThemedView";

import { useState } from "react";
import { Href, router } from "expo-router";
import { ThemedText } from "../basic/ThemedText";
import HorizontalView from "../basic/containers/HorizontalView";
import UserAvatar from "../navigation/UserAvatar";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { GroupWalk } from "@/context/WalksContext";
import { Card, View } from "react-native-ui-lib";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { Tag } from "./Tag";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useWalks } from "@/hooks/useWalks";

export default function GroupWalkListItem({
  groupWalk,
  markJoined,
  markCreated,
}: {
  groupWalk: GroupWalk;
  markJoined?: boolean;
  markCreated?: boolean;
}) {
  const { userId } = useAuth();

  const percentToDP = useWindowDimension("shorter");
  const heightpercentToDP = useWindowDimension("height");

  const backgroundColor = useThemeColor("accent") + "28";
  const borderColor = useThemeColor(
    markCreated && groupWalk.creator.userId === userId
      ? "accent"
      : markJoined &&
        groupWalk.participants.some((elem) => elem.userId === (userId ?? ""))
      ? "primary"
      : "transparent"
  );

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
    return groupWalk.locationName;
  };

  const getParticipantsCount = () => {
    return groupWalk.participants.length;
  };

  return (
    <Card
      backgroundColor={backgroundColor}
      borderRadius={percentToDP(10)}
      enableShadow={false}
      style={{
        paddingHorizontal: percentToDP(4.7),
        paddingVertical: percentToDP(3.7),
        marginBottom: percentToDP(3),
        borderColor: borderColor,

        borderWidth: 2,
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
            marginBottom: percentToDP(groupWalk.tags.length == 0 ? 1 : 5),
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
              height: percentToDP(1),
              borderRadius: percentToDP(10),
              marginTop: percentToDP(2),
              marginBottom: percentToDP(3),
            }}
          />
          {/* UNDER DIVIDER */}
          <HorizontalView
            justifyOption="space-between"
            colorName="transparent"
          >
            {/* LOCATION */}
            <HorizontalView
              justifyOption="flex-start"
              colorName="transparent"
            >
              <ThemedIcon
                size={22}
                style={{ marginLeft: percentToDP(-0.7) }}
                name="location"
              />
              <ThemedText
                textStyleOptions={{ size: "small" }}
                backgroundColorName="transparent"
                numberOfLines={1}
                style={{
                  paddingLeft: percentToDP(1),
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
                width: percentToDP(15.5),
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
                style={{ paddingLeft: percentToDP(1) }}
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
            marginBottom: percentToDP(groupWalk.tags.length == 0 ? 7.7 : 11.7),
            paddingLeft: percentToDP(4),
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
          marginRight: percentToDP(-1),
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
