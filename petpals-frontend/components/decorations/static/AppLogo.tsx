import { ThemedView } from "@/components/basic/containers/ThemedView";
import { Image } from "react-native-ui-lib";
import { ThemedText } from "@/components/basic/ThemedText";
import { AnimatedTextSwap } from "../animated/AnimatedTextSwap";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { useWindowDimension } from "@/hooks/useWindowDimension";

export default function AppLogo(props: {
  size: number;
  version?: "vertical" | "horizontal";
  showName?: boolean;
  showMotto?: boolean;
}) {
  const percentToDP = useWindowDimension("shorter");

  if (props.version === "horizontal") {
    return (
      <HorizontalView justifyOption="flex-start">
        <Image
          source={require("../../../assets/images/logo.png")}
          style={{
            // this causes navbar to overflow -> moved to parent components such as horizontalView
            // margin: percentToDP(0.2 * props.size),
            marginRight: percentToDP(0.09 * props.size),
            width: percentToDP(props.size),
            height: percentToDP(props.size),
          }}
        />
        {(props.showName ?? true) && (
          <ThemedText
            textColorName="title"
            textStyleOptions={{ font: "logo", weight: "bold" }}
            style={{
              fontSize: percentToDP(0.65 * props.size),
              marginLeft: percentToDP(0.08 * props.size),
              marginBottom: percentToDP(0.08 * props.size),
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
          marginBottom: props.showMotto ? percentToDP(19) : percentToDP(8),
        }}
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
            textStyleOptions={{ font: "logo", weight: "bold" }}
            style={{
              fontSize: percentToDP(0.17 * props.size),
              marginBottom: percentToDP(0.045 * props.size),
            }}
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
