import { ScrollView, ScrollViewProps } from "react-native";

import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";
import { useTheme } from "@react-navigation/native";

export type ThemedScrollViewProps = ScrollViewProps & {
  colorName?: ColorName;
  themedColor?: ThemedColor;
};

export function ThemedScrollView({
  style,
  colorName = "background",
  themedColor,
  ...otherProps
}: ThemedScrollViewProps) {
  const backgroundColor = useThemeColor(colorName, themedColor);
  const theme = useTheme();

  return (
    <ScrollView
      nestedScrollEnabled
      scrollEnabled
      automaticallyAdjustKeyboardInsets
      indicatorStyle={theme.dark ? "white" : "black"}
      style={[{ backgroundColor: backgroundColor }, style]}
      {...otherProps}
    />
  );
}
