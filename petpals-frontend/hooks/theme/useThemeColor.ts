import { ThemeColors } from "@/constants/theme/Colors";
import { useColorScheme } from "react-native";

export type ColorName = keyof typeof ThemeColors.light &
  keyof typeof ThemeColors.dark;

export type ThemedColor = { light: string; dark: string };

export function useThemeColor(
  colorName?: ColorName,
  themedColor?: ThemedColor
) {
  //const theme = useColorScheme() ?? "light";

  if (themedColor) {
    return themedColor["dark"]; //theme];
  } else {
    return ThemeColors["dark"][colorName ?? "text"]; //theme][colorName ?? "text"];
  }
}
