import { TextStyle } from "react-native";
import { Dictionary } from "react-native-ui-lib/src/typings/common";

export const assetsFonts = {
  SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  "Alata-Regular": require("../../assets/fonts/Alata-Regular.ttf"),
  "JosefinSans-Regular": require("../../assets/fonts/JosefinSans-Regular.ttf"),
  "JosefinSans-SemiBold": require("../../assets/fonts/JosefinSans-SemiBold.ttf"),
  "LeagueSpartan-Regular": require("../../assets/fonts/LeagueSpartan-Regular.ttf"),
};

const defaultFont = "LeagueSpartan-Regular";
const logoFont = "JosefinSans-SemiBold";

export const TextStyles: Dictionary<TextStyle> = {
  tiny: { fontFamily: defaultFont, fontSize: 12 },
  tinyBold: { fontFamily: defaultFont, fontWeight: "bold", fontSize: 12 },
  small: { fontFamily: defaultFont, fontSize: 16 },
  smallBold: { fontFamily: defaultFont, fontWeight: "bold", fontSize: 16 },
  default: { fontFamily: defaultFont, fontSize: 18 },
  defaultBold: { fontFamily: defaultFont, fontWeight: "bold", fontSize: 18 },
  header: { fontFamily: defaultFont, fontWeight: "bold", fontSize: 20 },
  logo: { fontFamily: logoFont, fontWeight: "bold" },
};
