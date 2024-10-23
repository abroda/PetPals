import { type TextProps } from "react-native";
import { Text } from "react-native-ui-lib";

import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";
import { TextStyleName, useTextStyle } from "@/hooks/theme/useTextStyle";

export type ThemedTextProps = TextProps & {
  center?: boolean;
  textColorName?: ColorName;
  textThemedColor?: ThemedColor;
  backgroundColorName?: ColorName;
  backgroundThemedColor?: ThemedColor;
  textStyleName?: TextStyleName;
};

export function ThemedText({
  style,
  center = false,
  textColorName = "text",
  textThemedColor,
  backgroundColorName = "background",
  backgroundThemedColor,
  textStyleName = "default",
  ...rest
}: ThemedTextProps) {
  const textColor = useThemeColor(textColorName, textThemedColor);
  const backgroundColor = useThemeColor(
    backgroundColorName,
    backgroundThemedColor
  );

  return (
    <Text
      center={center}
      style={[
        {
          color: textColor,
          backgroundColor: backgroundColor,
          flexWrap: "wrap",
          flexShrink: 1,
        },
        useTextStyle(textStyleName),
        style,
      ]}
      {...rest}
    />
  );
}
