import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { Href, router, useNavigation, usePathname } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { ThemedTextField } from "@/components/inputs/ThemedTextField";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import AppLogo from "@/components/decorations/static/AppLogo";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import {
  Checkbox,
  DateTimePicker,
  KeyboardAwareScrollView,
  TextFieldRef,
} from "react-native-ui-lib";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWalks } from "@/hooks/useWalks";
import { isLoaded } from "expo-font";
import { LocationMap } from "@/components/display/LocationMap";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import TagList from "@/components/lists/TagList";
import { GroupWalk, Entity } from "@/context/WalksContext";
import TagListInput from "@/components/inputs/TagListInput";
import ThemedDialog from "./ThemedDialog";
import PetAvatar from "../navigation/PetAvatar";
import { DogPicker } from "../inputs/DogPicker";

export default function GroupWalkParticipationDialog(props: {
  walkId: string;
  joined: boolean;
  dogs: Entity[];
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
  const { isProcessing, joinGroupWalk, leaveGroupWalk } = useWalks();

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

  const save = useCallback(async () => {
    asyncAbortController.current = new AbortController();
    let result = await joinGroupWalk(
      props.walkId,
      dogsParticipating,
      asyncAbortController.current
    );

    if (result.success) {
      props.onSave(dogsParticipating);
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

        {isProcessing && (
          <ThemedLoadingIndicator
            size={"large"}
            style={{ marginVertical: percentToDP(props.joined ? 15.5 : 6.5) }}
          />
        )}
        {!isProcessing && (
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
              label={props.joined ? "Save" : "Join"}
              backgroundColorName="primary"
              iconSource={() => (
                <ThemedIcon
                  name="checkmark"
                  size={20}
                  colorName="textOnPrimary"
                  style={{ marginLeft: percentToDP(2) }}
                />
              )}
              iconOnRight
              onPress={save}
              style={{ marginBottom: percentToDP(3), width: percentToDP(75.8) }}
            />
            {props.joined && (
              <ThemedButton
                label="Leave"
                textColorName={"text"}
                backgroundColorName="alarm"
                iconSource={() => (
                  <ThemedIcon
                    name="log-out-outline"
                    size={20}
                    colorName="text"
                    style={{ marginLeft: percentToDP(2) }}
                  />
                )}
                iconOnRight
                onPress={leave}
                style={{
                  marginBottom: percentToDP(3),
                  width: percentToDP(75.8),
                }}
              />
            )}
          </ThemedView>
        )}
      </ThemedScrollView>
    </ThemedDialog>
  );
}
