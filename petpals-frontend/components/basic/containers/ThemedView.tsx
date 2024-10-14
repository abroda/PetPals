import { DimensionValue, View, type ViewProps } from "react-native";

import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";

export type ThemedViewProps = ViewProps & {
  colorName?: ColorName;
  themedColor?: ThemedColor;
  width?: DimensionValue;
  height?: DimensionValue;
};

export function ThemedView({
  style,
  colorName = "background",
  themedColor,
  width,
  height,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(colorName, themedColor);

  return (
    <View
      style={[
        { backgroundColor: backgroundColor, width: width, height: height },
        style,
      ]}
      {...otherProps}
    />
  );
}
