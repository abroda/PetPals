import { ReactElement } from "react";
import { GridList } from "react-native-ui-lib";
import { ThemedView, ThemedViewProps } from "./ThemedView";
import { Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function HorizontalView(props: ThemedViewProps) {
  return (
    <ThemedView
      style={{ flex: 1, flexDirection: "row", alignItems: "flex-start" }}
    >
      {props.children}
    </ThemedView>
  );
}
