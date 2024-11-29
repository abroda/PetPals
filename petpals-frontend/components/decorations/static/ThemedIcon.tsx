// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
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
  const percentToDP = useWindowDimension("shorter");

  if (asset) {
    return (
      <Icon
        size={percentToDP(rest.size ?? 8)}
        source={asset}
        style={[{ marginTop: 10 }]}
        {...rest}
      />
    );
  } else {
    return (
      <Ionicons
        size={percentToDP(rest.size ?? 8)}
        name={name}
        style={[
          {
            color: color, //marginTop: 10,
            marginBottom: -3,
            backgroundColor: "transparent",
          },
          style,
        ]}
        {...rest}
      />
    );
  }
}
