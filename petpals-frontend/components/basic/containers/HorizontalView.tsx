import {ThemedView, ThemedViewProps} from "./ThemedView";

export type HorizontalViewProps = ThemedViewProps & {
    justifyOption?:
        | "center"
        | "space-between"
        | "space-evenly"
        | "flex-end"
        | "flex-start";
    shouldExpand?: boolean;
};

export default function HorizontalView({
                                           justifyOption = "space-between",
                                           shouldExpand = true,
                                           ...props
                                       }: HorizontalViewProps) {
    return (
        <ThemedView
            style={[
                {
                    flex: shouldExpand ? 1 : undefined,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: justifyOption,
                },
            ]}
            {...props}
        >
            {props.children}
        </ThemedView>
    );
}
