import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { Text } from "react-native-ui-lib";
import { PropsWithChildren, useEffect, useState } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

type AnimatedTextSwapProps = { texts: string[] } & PropsWithChildren<{
  style?: ViewStyle;
}>;

export function AnimatedTextSwap(props: AnimatedTextSwapProps) {
  const [currentText, setCurrentText] = useState(0);
  const fadeAnimation = useSharedValue(0);

  const fadeIn = () => withTiming(1, { duration: 1200, easing: Easing.cubic });
  const fadeOut = () =>
    withDelay(
      3000,
      withTiming(0, { duration: 1200, easing: Easing.cubic }, (finished) => {
        if (finished) {
          runOnJS(setCurrentText)((currentText + 1) % props.texts.length);
        }
      })
    );
  const fadeInAndOut = () => withRepeat(withSequence(fadeIn(), fadeOut()), 0);

  useEffect(() => {
    fadeAnimation.value = fadeInAndOut();
  });

  return (
    <ThemedView style={props.style}>
      <Animated.View
        style={{
          ...props.style,
          opacity: fadeAnimation,
        }}
      >
        <ThemedText center={true}>{props.texts[currentText]}</ThemedText>
      </Animated.View>
    </ThemedView>
  );
}
