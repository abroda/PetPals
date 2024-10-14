import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/basic/containers/ThemedView";

import { Avatar, View, Text } from "react-native-ui-lib";
import { useState } from "react";
import { Link } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileLink(props: { username: string }) {
  const { userEmail } = useAuth();
  const [selected, setSelected] = useState("");

  return (
    <ThemedView style={styles.topBar}>
      <Text
        text30BL
        cyan10
        style={styles.accountName}
      >
        {props.username}
      </Text>
      <Link
        href={
          userEmail === props.username ? "/user/me" : "/user/" + props.username
        }
      >
        <Avatar
          source={{
            uri: "https://external-preview.redd.it/PzM9Myb5uugh3qrxvb1F0nVTsdXJKRl0NB88MuAPwZA.jpg?auto=webp&s=6627165dbd61ab8a8d7fc026b5ce9199c593fe93",
          }}
        />
      </Link>
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
