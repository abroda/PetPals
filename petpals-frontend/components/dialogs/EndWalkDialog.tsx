import { useEffect, useRef, useState } from "react";
import { ThemedText } from "../basic/ThemedText";
import { ThemedScrollView } from "../basic/containers/ThemedScrollView";
import { ThemedButton } from "../inputs/ThemedButton";
import { ThemedTextField } from "../inputs/ThemedTextField";
import HorizontalView from "../basic/containers/HorizontalView";
import { router } from "expo-router";
import ThemedDialog, { ThemedDialogProps } from "./ThemedDialog";
import validators from "react-native-ui-lib/src/components/textField/validators";
import { useAuth } from "@/hooks/useAuth";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import ThemedLoadingIndicator from "../decorations/animated/ThemedLoadingIndicator";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { KeyboardAwareScrollView, TextFieldRef } from "react-native-ui-lib";
import { GroupWalkTag, tagRegex } from "@/context/GroupWalksContext";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { Tag } from "../display/Tag";
import TagList from "../lists/TagList";

export default function EndWalkDialog({
  delay,
  message,
  onDismiss,
  onEnd,
}: {
  delay: boolean;
  message: string;
  onDismiss: () => void;
  onEnd: () => void | Promise<void>;
}) {
  const asyncAbortController = useRef<AbortController | undefined>(undefined);

  const percentToDP = useWindowDimension("shorter");

  useEffect(() => {
    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  async function submit() {
    await onEnd();
    onDismiss();
  }

  return (
    <ThemedDialog onDismiss={onDismiss}>
      <KeyboardAwareScrollView
        style={{
          paddingHorizontal: percentToDP(3),
          paddingTop: percentToDP(1),
          paddingBottom: percentToDP(3),
          alignContent: "center",
        }}
      >
        <ThemedText
          textStyleOptions={{ size: "big", weight: "bold" }}
          style={{ marginBottom: percentToDP(4) }}
        >
          End walk
        </ThemedText>
        <ThemedText style={{ marginBottom: percentToDP(2) }}>
          {message}
        </ThemedText>
        <ThemedButton
          label={delay ? "Delay timeout" : "Stop recording"}
          textColorName="text"
          backgroundColorName="alarm"
          style={{
            marginBottom: percentToDP(2),
            alignSelf: "center",
            width: percentToDP(75),
          }}
          onPress={submit}
        />
        <ThemedButton
          label="Cancel"
          textColorName="textOnSecondary"
          backgroundColorName="secondary"
          style={{
            marginTop: percentToDP(3),
            marginBottom: percentToDP(2),
            alignSelf: "center",
            width: percentToDP(75),
          }}
          onPress={onDismiss}
        />
      </KeyboardAwareScrollView>
    </ThemedDialog>
  );
}
