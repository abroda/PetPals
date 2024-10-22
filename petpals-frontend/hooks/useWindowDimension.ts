import { Dimensions } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

export function useWindowDimension(
  edge: "width" | "height" | "shorter" | "longer"
) {
  if (edge === "width") {
    return widthPercentageToDP;
  } else if (edge === "height") {
    return heightPercentageToDP;
  } else if (edge === "longer") {
    if (Dimensions.get("window").height > Dimensions.get("window").width) {
      return heightPercentageToDP;
    }

    return widthPercentageToDP;
  } else {
    // edge === "shorter", also default option
    if (Dimensions.get("window").height > Dimensions.get("window").width) {
      return widthPercentageToDP;
    }

    return heightPercentageToDP;
  }
}
