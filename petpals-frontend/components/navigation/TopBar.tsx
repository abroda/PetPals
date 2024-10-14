import { StyleSheet } from "react-native";

import {
  ThemedView,
  ThemedViewProps,
} from "@/components/containers/ThemedView";

import { Avatar, View, Text, Button } from "react-native-ui-lib";
import { useState } from "react";
import { Link } from "expo-router";
import ProfileLink from "./ProfileLink";

export type TopBarProps = ThemedViewProps & {
  showBackButton?: boolean;
  showNotificationBell?: boolean;
  notificationsPending?: number;
  showUserAvatar?: boolean;
  showOptionsButton?: boolean;
};

export default function TopBar({
  style,
  showBackButton = true,
  showNotificationBell = false,
  notificationsPending = undefined,
  showUserAvatar = false,
  showOptionsButton = false,
  ...rest
}: TopBarProps) {
  return (
    <ThemedView style={styles.topBar}>
      {showBackButton && <Button>{"<-"}</Button>}
      {showUserAvatar && <ProfileLink username="me" />}
      {showOptionsButton && <Button>...</Button>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  tabPage: {
    height: "100%",
    width: "100%",
  },
  topBar: {
    flexDirection: "row",
    width: "100%",
    margin: 10,
    justifyContent: "flex-end",
  },
  accountHeader: {
    flexDirection: "row",
    padding: 10,
  },
  accountName: {
    paddingHorizontal: 20,
  },
  agenda: {},
});
