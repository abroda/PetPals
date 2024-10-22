import { ThemedView } from "@/components/basic/containers/ThemedView";
import { Image } from "react-native-ui-lib";
import { Dimensions } from "react-native";
import { ThemedText } from "@/components/basic/ThemedText";
import { AnimatedTextSwap } from "../animated/AnimatedTextSwap";
import { version } from "react";
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
            margin: percentToDP(30 * (props.size / 100)),
            marginRight: percentToDP(16 * (props.size / 100)),
            width: percentToDP(props.size * 2),
            height: percentToDP(props.size * 2),
          }}
        />
        {(props.showName ?? true) && (
          <ThemedText
            textColorName="title"
            textStyleName="logo"
            style={{
              fontSize: percentToDP(130 * (props.size / 100)),
              marginLeft: percentToDP(16 * (props.size / 100)),
              marginBottom: percentToDP(16 * (props.size / 100)),
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
          marginBottom: props.showMotto ? percentToDP(25) : percentToDP(4),
        }}
      >
        <Image
          source={require("../../../assets/images/logo.png")}
          style={{
            display: "flex",
            marginLeft: "auto",
            marginTop: percentToDP(16 * (props.size / 100)),
            marginRight: "auto",
            marginBottom: percentToDP(6 * (props.size / 100)),
            width: percentToDP(props.size * 2),
            height: percentToDP(props.size * 2),
          }}
        />
        {(props.showName ?? true) && (
          <ThemedText
            textColorName="title"
            textStyleName="logo"
            style={{
              fontSize: percentToDP(34 * (props.size / 100)),
              marginBottom: percentToDP(16 * (props.size / 100)),
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
              width: percentToDP(props.size * 2),
            }}
          />
        )}
      </ThemedView>
    );
  }
}
