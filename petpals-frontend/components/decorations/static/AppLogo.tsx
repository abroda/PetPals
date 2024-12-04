import { ThemedView } from "@/components/basic/containers/ThemedView";
import { Image } from "react-native-ui-lib";
import { ThemedText } from "@/components/basic/ThemedText";
import { AnimatedTextSwap } from "../animated/AnimatedTextSwap";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import {ColorName, useThemeColor} from "@/hooks/theme/useThemeColor";

export default function AppLogo(props: {
  size: number;
  version?: "vertical" | "horizontal";
  showName?: boolean;
  showMotto?: boolean;
  backgroundColorName?: ColorName,
}) {
  const percentToDP = useWindowDimension("shorter");

  if (props.version === "horizontal") {
    return (
      <HorizontalView justifyOption="flex-start" colorName={props.backgroundColorName}>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={{
            // this causes navbar to overflow -> moved to parent components such as horizontalView
            // margin: percentToDP(0.2 * props.size),
            marginRight: percentToDP(0.09 * props.size),
            width: percentToDP(props.size),
            height: percentToDP(props.size),
            borderWidth: 0,
            borderColor: useThemeColor("tertiary"),
            borderRadius: percentToDP(100),
            elevation: (props.backgroundColorName == "secondary") ? 15 : 0,
          }}
        />
        {(props.showName ?? true) && (
          <ThemedText
            textColorName="title"
            textStyleOptions={{
              font: "logo",
              weight: "bold",
              size: percentToDP(0.65 * props.size),
            }}
            backgroundColorName={props.backgroundColorName}
            style={{
              marginLeft: percentToDP(0.08 * props.size),
              marginBottom: percentToDP(0.02 * props.size),
            }}
          >
            PetPals
          </ThemedText>
        )}
      </HorizontalView>
    );
  } else {
    return (
      <ThemedView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: props.showMotto ? percentToDP(30) : percentToDP(8),
          backgroundColor: 'transparent'
        }}
        colorName={props.backgroundColorName}
      >
        <Image
          source={require("../../../assets/images/logo.png")}
          style={{
            display: "flex",
            marginLeft: "auto",
            marginTop: percentToDP(0.08 * props.size),
            marginRight: "auto",
            marginBottom: percentToDP(0.03 * props.size),
            width: percentToDP(props.size),
            height: percentToDP(props.size),
          }}
        />
        {(props.showName ?? true) && (
          <ThemedText
            textColorName="title"
            textStyleOptions={{
              font: "logo",
              weight: "bold",
              size: percentToDP(0.17 * props.size),
            }}
            style={{
              marginBottom: percentToDP(0.045 * props.size),
            }}
            backgroundColorName={props.backgroundColorName}
          >
            PetPals
          </ThemedText>
        )}
        {(props.showMotto ?? true) && (
          <AnimatedTextSwap
            texts={[
              "Walk. Explore. Connect.",
              "For every tail, every trail.",
              "Your pet's best friend, after You.",
              "Together, at every step.",
            ]}
            style={{
              width: percentToDP(props.size),
            }}
          />
        )}
      </ThemedView>
    );
  }
}
