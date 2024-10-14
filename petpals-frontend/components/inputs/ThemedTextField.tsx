import { TextField, TextFieldProps } from "react-native-ui-lib";
import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";
import { TextStyleName, useTextStyle } from "@/hooks/theme/useTextStyle";

export type ThemedTextProps = TextFieldProps & {
  textColorName?: ColorName;
  textThemedColor?: ThemedColor;
  backgroundColorName?: ColorName;
  backgroundThemedColor?: ThemedColor;
  textStyleName?: TextStyleName;
};

export function ThemedTextField({
  style,
  textColorName = "text",
  textThemedColor = undefined,
  backgroundColorName = "textField",
  backgroundThemedColor = undefined,
  textStyleName = "default",
  ...rest
}: ThemedTextProps) {
  const textColor = useThemeColor(textColorName, textThemedColor);
  const backgroundColor = useThemeColor(
    backgroundColorName,
    backgroundThemedColor
  );

  return (
    <TextField
      labelColor={textColor}
      labelStyle={useTextStyle(textStyleName)}
      style={[
        {
          color: textColor,
          backgroundColor: backgroundColor,
          borderRadius: 28,
          borderColor: textColor,
          paddingHorizontal: 10,
          paddingVertical: 8,
        },
        style,
      ]}
      {...rest}
    />
  );
}
