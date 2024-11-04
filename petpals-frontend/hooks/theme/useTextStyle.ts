import { TextStyleConstants } from "@/constants/theme/TextStyles";
import { TextStyle } from "react-native";

export type TextStyleOptions = {
  size?: "tiny" | "small" | "medium" | "big" | "veryBig" | number;
  weight?: "thin" | "light" | "regular" | "semibold" | "bold";
  font?: "default" | "logo";
};

export function useTextStyle(styleName: TextStyleOptions): TextStyle {
  return {
    fontFamily:
      TextStyleConstants[styleName.font ?? "default"] +
      TextStyleConstants[styleName.weight ?? "regular"],
    fontSize:
      typeof styleName.size === "number"
        ? styleName.size
        : TextStyleConstants[styleName.size ?? "medium"],
  };
}
