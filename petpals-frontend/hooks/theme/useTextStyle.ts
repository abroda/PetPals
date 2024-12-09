import { TextStyleConstants } from "@/constants/theme/TextStyles";
import { TextStyle } from "react-native";

export type TextStyleOptions = {
  size?:
    | "tiny"
    | "small"
    | "medium"
    | "biggerMedium"
    | "big"
    | "veryBig"
    | number;
  weight?: "thin" | "light" | "regular" | "semibold" | "bold";
  font?: "default" | "logo";
};

export function useTextStyle(styleOptions: TextStyleOptions): TextStyle {
  return {
    fontFamily:
      TextStyleConstants[styleOptions.font ?? "default"] +
      TextStyleConstants[styleOptions.weight ?? "regular"],
    fontSize:
      typeof styleOptions.size === "number"
        ? styleOptions.size
        : TextStyleConstants[styleOptions.size ?? "medium"],
    lineHeight:
      1.2 *
      (typeof styleOptions.size === "number"
        ? styleOptions.size
        : TextStyleConstants[styleOptions.size ?? "medium"]),
  };
}
