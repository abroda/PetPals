import {
  ThemedView,
  ThemedViewProps,
} from "@/components/basic/containers/ThemedView";
import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  Dimensions,
} from "react-native";
import { ThemedText } from "../../basic/ThemedText";
import { LoaderScreen } from "react-native-ui-lib";
import { ThemeColors } from "@/constants/theme/Colors";

export type ThemedLoadingIndicatorProps = ActivityIndicatorProps & {
  colorName?: ColorName;
  themedColor?: ThemedColor;
  textColorName?: ColorName;
  textThemedColor?: ThemedColor;
  message?: string;
  fullScreen?: boolean;
};

export default function ThemedLoadingIndicator({
  colorName = "accent",
  themedColor,
  textColorName = "text",
  textThemedColor,
  message = "",
  fullScreen = false,
  ...rest
}: ThemedLoadingIndicatorProps) {
  const loaderColor = useThemeColor(colorName, themedColor);
  const textColor = useThemeColor(textColorName, textThemedColor);
  const backgroundColor = useThemeColor("background");

  if (fullScreen) {
    return (
      <ThemedView
        style={{
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          alignSelf: "center",
        }}
      >
        <ActivityIndicator
          color={loaderColor}
          {...rest}
        />
        <ThemedText
          textColorName={textColorName}
          style={{ marginTop: 10 }}
        >
          {message}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator
        color={loaderColor}
        {...rest}
      />
      <ThemedText
        textColorName={textColorName}
        style={{ marginTop: 7 }}
      >
        {message}
      </ThemedText>
    </ThemedView>
  );
}
