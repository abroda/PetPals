import { DimensionValue, View, type ViewProps } from "react-native";

import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";
import { Ref } from "react";

export type ThemedViewProps = ViewProps & {
  ref?: Ref<View>;
  colorName?: ColorName;
  themedColor?: ThemedColor;
};

export function ThemedView({
  ref,
  style,
  colorName = "background",
  themedColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(colorName, themedColor);

  return (
    <View
      ref={ref}
      style={[{ backgroundColor: backgroundColor }, style]}
      {...otherProps}
    />
  );
}
