import { DimensionValue, View, type ViewProps } from "react-native";

import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";

export type ThemedViewProps = ViewProps & {
  colorName?: ColorName;
  themedColor?: ThemedColor;
};

export function ThemedView({
  style,
  colorName = "background",
  themedColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(colorName, themedColor);

  return (
    <View
      style={[{ backgroundColor: backgroundColor }, style]}
      {...otherProps}
    />
  );
}
