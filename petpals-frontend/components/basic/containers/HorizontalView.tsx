import { ThemedView, ThemedViewProps } from "./ThemedView";

export default function HorizontalView(props: ThemedViewProps) {
  return (
    <ThemedView
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "5%",
      }}
      {...props}
    >
      {props.children}
    </ThemedView>
  );
}
