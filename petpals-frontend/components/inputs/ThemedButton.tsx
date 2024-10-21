import { StyleSheet } from "react-native";
import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";
import { Button, ButtonProps } from "react-native-ui-lib";
import { TextStyles } from "@/constants/theme/TextStyles";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { ThemedIcon } from "../decorations/static/ThemedIcon";

export type ThemedButtonProps = ButtonProps & {
  href?: string;
  iconName?: string;
  backgroundColorName?: ColorName;
  backgroundThemedColor?: ThemedColor;
  textColorName?: ColorName;
  textThemedColor?: ThemedColor;
  type?: "long" | "half" | "small" | "with_icon" | "icon_only";
};

export const ThemedButton = ({
  style,
  iconName,
  backgroundColorName = "primary",
  backgroundThemedColor,
  textColorName = "text",
  textThemedColor,
  type = "long",
  ...rest
}: ThemedButtonProps) => {
  const backgroundColor = useThemeColor(
    backgroundColorName,
    backgroundThemedColor
  );
  const textColor = useThemeColor(textColorName, textThemedColor);
  return (
    <Button
      color={textColor}
      labelStyle={useTextStyle("default")}
      style={[
        {
          backgroundColor: backgroundColor,
          borderColor: useThemeColor("text"),
          width: "100%",
        },
        style,
      ]}
      {...rest}
    ></Button>
  );
};
