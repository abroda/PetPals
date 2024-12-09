import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { RadioButton, RadioGroup, View } from "react-native-ui-lib";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { ScrollView } from "react-native-gesture-handler";
import HorizontalView from "../basic/containers/HorizontalView";

export default function StartWalkDialog(props: {
  groupWalks: GroupWalk[];
  dogs: Dog[];
  onStart: (
    dogsParticipating: string[],
    visibility: "Public" | "Friends" | "Private",
    groupWalk?: GroupWalk
  ) => Promise<{ success: boolean; returnValue: any }>;
  onDismiss: () => void;
}) {
  const [chosenGroupWalk, setChosenGroupWalk] = useState<
    GroupWalk | undefined
  >();
  const [dogsParticipating, setDogsParticipating] = useState([] as string[]);
  const [visibilityMode, setVisibilityMode] = useState<
    "Public" | "Friends" | "Private"
  >("Public");
  const [errorMessage, setErrorMessage] = useState(" ");

  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();

  const radioButtonColor = useThemeColor("primary");
  const textColor = useThemeColor("text");
  const textStyle = useTextStyle({ weight: "semibold" });
  const iconColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  const submit = async () => {
    if (dogsParticipating.length === 0) {
      setErrorMessage("At least one dog needs to participate.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    let result = await props.onStart(
      dogsParticipating,
      visibilityMode,
      chosenGroupWalk
    );

    setIsLoading(false);

    if (result.success) {
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
          Start recording
        </ThemedText>
        <ScrollView style={{ maxHeight: heightPercentToDP(38) }}>
          <RadioGroup>
            <View
              key={"v"}
              style={{ marginBottom: percentToDP(2) }}
            >
              <RadioButton
                key={"r"}
                label="Solitary walk"
                onPress={() => {
                  setChosenGroupWalk(undefined);
                }}
                color={radioButtonColor}
                labelStyle={{ color: textColor, ...textStyle }}
                selected={!chosenGroupWalk}
              />
              {!chosenGroupWalk && (
                <DogPicker
                  key={"d"}
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
                  style={{
                    marginBottom: percentToDP(2),
                    marginTop: percentToDP(2),
                  }}
                />
              )}
            </View>
            {props.groupWalks.map((elem) => (
              <View
                key={elem.id + "v"}
                style={{ marginBottom: percentToDP(2) }}
              >
                <RadioButton
                  key={elem.id + "r"}
                  label={`${new Date(elem.datetime).toLocaleTimeString(undefined, { timeStyle: "short" })} - ${elem.title}`}
                  onPress={() => {
                    setChosenGroupWalk(elem);
                    setDogsParticipating(
                      elem.participants
                        .find((item) => item.userId === userId)
                        ?.dogs?.map((d) => d.dogId) ?? []
                    );
                  }}
                  color={radioButtonColor}
                  labelStyle={{ color: textColor, ...textStyle }}
                  selected={chosenGroupWalk?.id === elem.id}
                />
                {chosenGroupWalk?.id === elem.id && (
                  <DogPicker
                    key={elem.id + "d"}
                    header="Dogs attending"
                    dogs={props.dogs}
                    dogsParticipating={dogsParticipating}
                    onToggle={(dogId: string) => {}}
                    style={{
                      marginBottom: percentToDP(2),
                      marginTop: percentToDP(2),
                    }}
                  />
                )}
              </View>
            ))}
          </RadioGroup>
        </ScrollView>
        <HorizontalView
          colorName="secondary"
          style={{
            paddingVertical: percentToDP(4),
            paddingHorizontal: percentToDP(3),
            borderRadius: percentToDP(4),
            marginTop: percentToDP(3),
            marginBottom: percentToDP(2),
          }}
        >
          <ThemedText backgroundColorName="transparent">Visibility</ThemedText>

          <ThemedText
            textColorName="primary"
            backgroundColorName="transparent"
            onPress={() =>
              visibilityMode === "Public"
                ? setVisibilityMode("Friends")
                : visibilityMode === "Friends"
                  ? setVisibilityMode("Private")
                  : setVisibilityMode("Public")
            }
          >
            {visibilityMode}
          </ThemedText>
        </HorizontalView>
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
              onPress={submit}
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
