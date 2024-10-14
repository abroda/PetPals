import { ScrollView, ScrollViewProps } from "react-native";

import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";

export type ThemedViewProps = ScrollViewProps & {
  colorName?: ColorName;
  themedColor?: ThemedColor;
};

export function ThemedScrollView({
  style,
  colorName = "background",
  themedColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(colorName, themedColor);

  return (
    <ScrollView
      style={[{ backgroundColor: backgroundColor }, style]}
      {...otherProps}
    />
  );
}
