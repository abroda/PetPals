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
import { Participant } from "@/context/GroupWalksContext";
import ThemedDialog from "./ThemedDialog";
import { DogPicker } from "../inputs/DogPicker";
import { Dog } from "@/context/DogContext";

export default function JoinDialog(props: {
  walkId: string;
  joined: boolean;
  dogs: Dog[];
  dogsParticipating: string[];
  onSave: (dogsParticipating: string[]) => void;
  onLeave: () => void;
  onDismiss: () => void;
}) {
  const [dogsParticipating, setDogsParticipating] = useState(
    props.dogsParticipating
  );
  const [errorMessage, setErrorMessage] = useState(" ");

  const { userId } = useAuth();
  const { joinGroupWalk, leaveGroupWalk } = useGroupWalks();
  const [isLoading, setIsLoading] = useState(false);

  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  const asyncAbortController = useRef<AbortController | null>(null);

  const leave = useCallback(async () => {
    asyncAbortController.current = new AbortController();
    let result = await leaveGroupWalk(
      props.walkId,
      asyncAbortController.current
    );

    if (result.success) {
      props.onLeave();
      props.onDismiss();
    } else {
      setErrorMessage(result.returnValue);
    }
  }, []);

  const save = async () => {
    if (dogsParticipating.length === 0) {
      setErrorMessage("At least one dog needs to participate.");
      return;
    }
    asyncAbortController.current = new AbortController();
    let data = {
      dogIds: dogsParticipating,
    };
    let result = await joinGroupWalk(
      props.walkId,
      data,
      asyncAbortController.current
    );

    if (result.success) {
      props.onSave(dogsParticipating);
      props.onDismiss();
    } else {
      setErrorMessage(result.returnValue);
    }
  };

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
          Participation details
        </ThemedText>

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

        {isLoading && (
          <ThemedLoadingIndicator
            size={"large"}
            style={{ marginVertical: percentToDP(props.joined ? 15.5 : 6.5) }}
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
              label={
                props.joined
                  ? dogsParticipating.length === 0
                    ? "Leave"
                    : "Save"
                  : "Join"
              }
              textColorName={
                props.joined && dogsParticipating.length === 0
                  ? "text"
                  : "textOnPrimary"
              }
              backgroundColorName={
                props.joined && dogsParticipating.length === 0
                  ? "alarm"
                  : "primary"
              }
              iconSource={() => (
                <ThemedIcon
                  name={
                    props.joined && dogsParticipating.length === 0
                      ? "log-out-outline"
                      : "checkmark"
                  }
                  size={20}
                  colorName={
                    props.joined && dogsParticipating.length === 0
                      ? "text"
                      : "textOnPrimary"
                  }
                  style={{ marginLeft: percentToDP(2) }}
                />
              )}
              iconOnRight
              onPress={() =>
                props.joined && dogsParticipating.length === 0
                  ? leave()
                  : save()
              }
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
