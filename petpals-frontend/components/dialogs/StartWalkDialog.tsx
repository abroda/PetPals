import React, { useCallback, useRef, useState } from "react";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { useAuth } from "@/hooks/useAuth";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { useGroupWalks } from "@/hooks/useGroupWalks";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { GroupWalk, Participant } from "@/context/GroupWalksContext";
import ThemedDialog from "./ThemedDialog";
import { DogPicker } from "../inputs/DogPicker";
import { Dog } from "@/context/DogContext";
import { useWalks } from "@/hooks/useWalks";
import { RadioButton, RadioGroup } from "react-native-ui-lib";
import { useTextStyle } from "@/hooks/theme/useTextStyle";

export default function StartWalkDialog(props: {
  groupWalk: GroupWalk | null;
  dogs: Dog[];
  onStart: (
    dogsParticipating: string[],
    visibility: string,
    startingGroupWalk: boolean,
    abortController: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  onDismiss: () => void;
}) {
  const [startingGroupWalk, setStartingGroupWalk] = useState(false);
  const [dogsParticipating, setDogsParticipating] = useState([] as string[]);
  const [errorMessage, setErrorMessage] = useState(" ");

  const [isLoading, setIsLoading] = useState(false);

  const radioButtonColor = useThemeColor("primary");
  const textColor = useThemeColor("text");
  const textStyle = useTextStyle({ weight: "semibold" });
  const iconColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  const asyncAbortController = useRef<AbortController | null>(null);

  const start = useCallback(async () => {
    if (dogsParticipating.length === 0) {
      setErrorMessage("At least one dog needs to participate.");
    }

    asyncAbortController.current = new AbortController();
    let result = await props.onStart(
      dogsParticipating,
      "private",
      false,
      asyncAbortController.current
    );

    if (result.success) {
      props.onDismiss();
    } else {
      setErrorMessage(result.returnValue);
    }
  }, []);

  return (
    <ThemedDialog
      visible
      onDismiss={props.onDismiss}
    >
      <ThemedScrollView
        scrollEnabled={true}
        style={{
          paddingHorizontal: percentToDP(3),
          marginBottom: percentToDP(1),
        }}
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText
          textStyleOptions={{ size: "big", weight: "bold" }}
          style={{
            marginTop: percentToDP(3),
            marginBottom: percentToDP(4),
          }}
        >
          Start recording
        </ThemedText>
        <RadioGroup>
          <RadioButton
            label="Group walk"
            onPress={() => setStartingGroupWalk(true)}
            color={radioButtonColor}
            labelStyle={{ color: textColor, ...textStyle }}
            selected={startingGroupWalk}
          />
          {startingGroupWalk && (
            <ThemedView>
              <ThemedText>TODO: group walk details</ThemedText>
            </ThemedView>
          )}
          <RadioButton
            label="Solitary walk"
            onPress={() => setStartingGroupWalk(false)}
            color={radioButtonColor}
            labelStyle={{ color: textColor, ...textStyle }}
            selected={!startingGroupWalk}
          />
          {!startingGroupWalk && (
            <DogPicker
              header="Dogs attending"
              dogs={props.dogs}
              dogsParticipating={dogsParticipating}
              onToggle={(dogId: string) => {
                dogsParticipating.includes(dogId)
                  ? setDogsParticipating(
                      dogsParticipating.filter((elem) => elem !== dogId)
                    )
                  : setDogsParticipating([dogId, ...dogsParticipating]);
              }}
              style={{ padding: percentToDP(0) }}
            />
          )}
        </RadioGroup>

        {isLoading && (
          <ThemedLoadingIndicator
            size={"large"}
            style={{ marginVertical: percentToDP(6.5) }}
          />
        )}
        {!isLoading && (
          <ThemedView
            style={{
              marginTop: percentToDP(0),
              marginBottom: percentToDP(3),
            }}
          >
            <ThemedText
              textColorName="alarm"
              style={{
                marginBottom: percentToDP(4),
                marginLeft: percentToDP(1),
              }}
            >
              {errorMessage}
            </ThemedText>
            <ThemedButton
              label="Start"
              textColorName="textOnPrimary"
              backgroundColorName="primary"
              onPress={start}
              style={{ marginBottom: percentToDP(3), width: percentToDP(75.8) }}
            />
            <ThemedButton
              label={"Cancel"}
              textColorName="textOnSecondary"
              backgroundColorName="secondary"
              onPress={props.onDismiss}
              style={{ marginBottom: percentToDP(3), width: percentToDP(75.8) }}
            />
          </ThemedView>
        )}
      </ThemedScrollView>
    </ThemedDialog>
  );
}
