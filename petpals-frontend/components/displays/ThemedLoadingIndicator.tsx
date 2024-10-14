import {
  ThemedView,
  ThemedViewProps,
} from "@/components/basic/containers/ThemedView";
import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";
import { ActivityIndicator, Dimensions } from "react-native";
import { ThemedText } from "../basic/ThemedText";
import { LoaderScreen } from "react-native-ui-lib";
import { ThemeColors } from "@/constants/theme/Colors";

export type ThemedLoadingIndicatorProps = {
  colorName?: ColorName;
  themedColor?: ThemedColor;
  textColorName?: ColorName;
  textThemedColor?: ThemedColor;
  message?: string;
};

export default function ThemedLoadingIndicator({
  colorName = "accent",
  themedColor,
  textColorName = "text",
  textThemedColor,
  message = "Loading...",
}: ThemedLoadingIndicatorProps) {
  const loaderColor = useThemeColor(colorName, themedColor);
  const textColor = useThemeColor(textColorName, textThemedColor);
  const backgroundColor = useThemeColor("background");

  return (
    <ThemedView
      style={{
        width: "100%",
        height: "100%",
        padding: "50%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: backgroundColor,
      }}
    >
      <ActivityIndicator
        size="large"
        color={loaderColor}
        style={{ marginBottom: 8 }}
      />
      <ThemedText textColorName={textColorName}>{message}</ThemedText>
    </ThemedView>
  );
}
