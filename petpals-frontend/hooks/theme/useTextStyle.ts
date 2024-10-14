import { TextStyles } from "@/constants/theme/TextStyles";

export type TextStyleName = keyof typeof TextStyles;

export function useTextStyle(styleName: TextStyleName) {
  return TextStyles[styleName];
}
