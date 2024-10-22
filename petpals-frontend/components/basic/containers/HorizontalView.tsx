import { ThemedView, ThemedViewProps } from "./ThemedView";

export type HorizontalViewProps = ThemedViewProps & {
  justifyOption?:
    | "center"
    | "space-between"
    | "space-evenly"
    | "flex-end"
    | "flex-start";
};

export default function HorizontalView({
  style,
  justifyOption = "space-between",
  ...props
}: HorizontalViewProps) {
  return (
    <ThemedView
      style={[
        {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: justifyOption,
        },
        style,
      ]}
      {...props}
    >
      {props.children}
    </ThemedView>
  );
}
