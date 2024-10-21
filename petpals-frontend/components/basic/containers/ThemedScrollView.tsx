import { ScrollView, ScrollViewProps } from "react-native";

import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";

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

  return (
    <ScrollView
      nestedScrollEnabled
      scrollEnabled
      automaticallyAdjustKeyboardInsets
      style={[{ backgroundColor: backgroundColor }, style]}
      {...otherProps}
    />
  );
}
