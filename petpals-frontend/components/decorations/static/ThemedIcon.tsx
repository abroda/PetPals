// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";
import Ionicons from "@expo/vector-icons/Ionicons";
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";
import { Icon } from "react-native-ui-lib";

export type ThemedIconProps = IconProps<
  ComponentProps<typeof Ionicons>["name"]
> & {
  asset?: string;
  colorName?: ColorName;
  themedColor?: ThemedColor;
  active?: boolean;
};

export function ThemedIcon({
  style,
  asset = undefined,
  name = "help",
  colorName = "primary",
  themedColor = undefined,
  active = true,
  ...rest
}: ThemedIconProps) {
  const color = useThemeColor(colorName, themedColor);

  if (asset) {
    return (
      <Icon
        size={28}
        source={asset}
        style={[{ marginBottom: -3 }]}
        {...rest}
      />
    );
  } else {
    return (
      <Ionicons
        size={28}
        name={name}
        style={[{ color: color, marginBottom: -3 }, style]}
        {...rest}
      />
    );
  }
}
