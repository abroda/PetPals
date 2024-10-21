import { ThemedView } from "@/components/basic/containers/ThemedView";
import { Image } from "react-native-ui-lib";
import { Dimensions } from "react-native";
import { ThemedText } from "@/components/basic/ThemedText";
import { AnimatedTextSwap } from "../animated/AnimatedTextSwap";
import { version } from "react";
import HorizontalView from "@/components/basic/containers/HorizontalView";

export default function AppLogo(props: {
  size: number;
  version?: "vertical" | "horizontal";
  showName?: boolean;
  showMotto?: boolean;
}) {
  var longerEdge = Dimensions.get("window").height;
  if (longerEdge < Dimensions.get("window").width) {
    longerEdge = Dimensions.get("window").width;
  }

  const heightToWidthRatio = 100 / 100;
  var width = (props.size / 100) * longerEdge;
  var height = (props.size / 100) * heightToWidthRatio * longerEdge;

  if (props.version === "horizontal") {
    return (
      <HorizontalView justifyOption="flex-start">
        <Image
          source={require("../../../assets/images/logo.png")}
          style={{
            margin: 0.15 * (props.size / 100) * longerEdge,
            marginRight: 0.08 * (props.size / 100) * longerEdge,
            width: width,
            height: height,
          }}
        />
        {(props.showName ?? true) && (
          <ThemedText
            textColorName="title"
            textStyleName="logo"
            style={{
              fontSize: (props.size / 100) * longerEdge * 0.65,
              marginLeft: 0.08 * (props.size / 100) * longerEdge,
              marginBottom: 0.08 * (props.size / 100) * longerEdge,
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
          width: "100%",
          height: "100%",
          marginBottom: 0.08 * longerEdge,
        }}
      >
        <Image
          source={require("../../../assets/images/logo.png")}
          style={{
            display: "flex",
            marginLeft: "auto",
            marginTop: 0.08 * (props.size / 100) * longerEdge,
            marginRight: "auto",
            marginBottom: 0.03 * (props.size / 100) * longerEdge,
            width: width,
            height: height,
          }}
        />
        {(props.showName ?? true) && (
          <ThemedText
            textColorName="title"
            textStyleName="logo"
            style={{
              fontSize: (props.size / 100) * longerEdge * 0.17,
              marginBottom: 0.08 * (props.size / 100) * longerEdge,
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
              width: width,
            }}
          />
        )}
      </ThemedView>
    );
  }
}
