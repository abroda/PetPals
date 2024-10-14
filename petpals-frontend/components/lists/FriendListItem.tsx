import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/basic/containers/ThemedView";

import { Avatar, View, Text } from "react-native-ui-lib";
import { useState } from "react";
import { Link } from "expo-router";

export default function FriendListItem(props: { username: string }) {
  const [selected, setSelected] = useState("");

  return (
    <ThemedView style={styles.topBar}>
      <Link href={"/user/" + props.username}>
        <Avatar
          source={{
            uri: "https://external-preview.redd.it/PzM9Myb5uugh3qrxvb1F0nVTsdXJKRl0NB88MuAPwZA.jpg?auto=webp&s=6627165dbd61ab8a8d7fc026b5ce9199c593fe93",
          }}
        />
      </Link>
      <View>
        <Text
          text30BL
          cyan10
          style={styles.accountName}
        >
          {props.username}
        </Text>
        <Text
          text15
          white
          style={styles.accountName}
        >
          {props.username}
        </Text>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    width: "100%",
    margin: 10,
    justifyContent: "flex-start",
  },
  accountName: {
    paddingHorizontal: 20,
  },
});
