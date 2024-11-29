import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";
import { Button, ButtonProps } from "react-native-ui-lib";
import { TextStyleOptions, useTextStyle } from "@/hooks/theme/useTextStyle";
import { ThemedIcon, ThemedIconProps } from "../decorations/static/ThemedIcon";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";

export type ThemedButtonProps = ButtonProps & {
  backgroundColorName?: ColorName;
  backgroundThemedColor?: ThemedColor;
  textColorName?: ColorName;
  textThemedColor?: ThemedColor;
  textStyleOptions?: TextStyleOptions;
  shape?: "long" | "half" | "short" | "round";
  border?: boolean;
  iconName?: ComponentProps<typeof Ionicons>["name"];
  iconSize?: number;
};

export const ThemedButton = ({
  style,
  backgroundColorName = "primary",
  backgroundThemedColor,
  textColorName = "textOnPrimary",
  textThemedColor,
  textStyleOptions = {},
  shape = "long",
  border = false,
  iconName,
  iconSize,
  ...rest
}: ThemedButtonProps) => {
  const backgroundColor = useThemeColor(
    backgroundColorName,
    backgroundThemedColor
  );
  const textColor = useThemeColor(textColorName, textThemedColor);
  const percentToDP = useWindowDimension("shorter");
  const textStyle = useTextStyle(textStyleOptions);

  return (
    <Button
      color={textColor}
      labelStyle={[
        textStyle,
        {
          marginBottom: percentToDP(iconName && shape === "short" ? -0.8 : 0.6),
        },
      ]}
      size={
        shape === "long"
          ? "large"
          : shape == "half"
          ? "medium"
          : shape === "short"
          ? "small"
          : "xSmall"
      }
      style={[
        {
          backgroundColor: backgroundColor,
          borderColor: textColor,
          borderRadius: percentToDP(10),
          paddingBottom:
            iconName && shape === "short" ? percentToDP(2.2) : undefined,
          width: percentToDP(
            shape === "long"
              ? 89
              : shape == "half"
              ? 48
              : shape === "short"
              ? 27
              : 15
          ),
          height: percentToDP(shape === "short" ? 10 : 15),
          borderWidth: border ? 2 : 0,
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      iconSource={
        iconName
          ? () => (
              <ThemedIcon
                size={iconSize ?? textStyle.fontSize}
                name={iconName}
                colorName={textColorName}
                style={{
                  paddingRight: percentToDP(rest.iconOnRight ? 0 : 0.4),
                  paddingLeft: percentToDP(rest.iconOnRight ? 0.4 : 0),
                  paddingBottom: percentToDP(0.4),
                }}
              />
            )
          : undefined
      }
      {...rest}
    ></Button>
  );
};
