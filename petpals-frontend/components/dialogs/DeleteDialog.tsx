import { useEffect, useRef, useState } from "react";
import { ThemedText } from "../basic/ThemedText";
import { ThemedScrollView } from "../basic/containers/ThemedScrollView";
import { ThemedButton } from "../inputs/ThemedButton";
import { ThemedTextField } from "../inputs/ThemedTextField";
import HorizontalView from "../basic/containers/HorizontalView";
import { router } from "expo-router";
import ThemedDialog from "./ThemedDialog";
import validators from "react-native-ui-lib/src/components/textField/validators";
import { useAuth } from "@/hooks/useAuth";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import ThemedLoadingIndicator from "../decorations/animated/ThemedLoadingIndicator";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { KeyboardAwareScrollView, TextFieldRef } from "react-native-ui-lib";
import { GroupWalkTag, tagRegex } from "@/context/WalksContext";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { Tag } from "../display/Tag";
import TagList from "../lists/TagList";

export default function DeleteDialog({
  message = "Delete content?",
  onDismiss,
  onSubmit,
}: {
  message: string;
  onDismiss: () => void;
  onSubmit: (
    abortController: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const asyncAbortController = useRef<AbortController | undefined>(undefined);

  const percentToDP = useWindowDimension("shorter");

  useEffect(() => {
    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  async function submit() {
    setErrorMessage("");
    asyncAbortController.current = new AbortController();

    let result = await onSubmit(asyncAbortController.current!);

    if (result.success) {
      onDismiss();
    } else {
      setErrorMessage(result.returnValue);
    }
  }

  return (
    <ThemedDialog
      visible
      onDismiss={onDismiss}
    >
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
          Delete content
        </ThemedText>
        <ThemedText>{message}</ThemedText>
        <ThemedText
          textColorName="alarm"
          textStyleOptions={{ size: "small" }}
          style={{ marginBottom: percentToDP(2) }}
        >
          {errorMessage}
        </ThemedText>
        <ThemedButton
          label="Delete"
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
