import React, { useEffect, useRef, useState } from "react";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { ThemedTextField } from "@/components/inputs/ThemedTextField";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import AppLogo from "@/components/decorations/static/AppLogo";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import TermsOfUseDialog from "@/components/dialogs/TermsOfUseDialog";
import { Checkbox, TextFieldRef } from "react-native-ui-lib";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWalks } from "@/hooks/useWalks";
import { testData } from "../testData";
import { isLoaded } from "expo-font";

export default function EditGroupWalkScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [walkData, setWalkData] = useState(testData[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [termsAgreedTo, setTermsAgreedTo] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const { isProcessing, updateGroupWalk } = useWalks();

  // to have all fields get validated at once on submit
  const nameRef = useRef<TextFieldRef>(null);
  const emailRef = useRef<TextFieldRef>(null);
  const passwordRef = useRef<TextFieldRef>(null);
  const repeatPasswordRef = useRef<TextFieldRef>(null);

  const textColor = useThemeColor("text");
  const textStyle = useTextStyle({ size: "small" });
  const accentColor = useThemeColor("accent");
  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");

  // to cancel async calls still being processed on unmount,
  // to avoid them executing unwanted effects in the background
  const asyncAbortController = useRef<AbortController | undefined>(undefined);
  useEffect(() => {
    asyncAbortController.current = new AbortController();
    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  // update repeat password validation message on password change
  useEffect(() => {
    if (isLoading) {
      // TODO: get post data
    }
  }, []);

  function validate() {
    let res = nameRef.current?.validate();
    res = emailRef.current?.validate() && res;
    res = passwordRef.current?.validate() && res;
    return repeatPasswordRef.current?.validate() && res;
  }

  async function submit() {
    setValidationMessage("");

    if (validate()) {
      if (!termsAgreedTo) {
        setValidationMessage("You have to accept Terms of Use.");
      } else {
        let result = { success: true, returnValue: testData[0] as any }; // await updateGroupWalk(walkId, {}, asyncAbortController);

        if (result.success) {
          setDialogVisible(false);
          router.push("..");
        } else {
          setValidationMessage(result.returnValue);
          asyncAbortController.current = new AbortController();
          // get a new abortController in case old one was called
          // (once the abort signal is set through .abort() it stays on)
        }
      }
    }
  }

  return (
    <SafeAreaView>
      <ThemedScrollView
        style={{
          height: heighPercentToDP(100),
          paddingTop: percentToDP(10),
        }}
      >
        {dialogVisible && (
          <TermsOfUseDialog onDismiss={() => setDialogVisible(false)} />
        )}
        {isLoading && (
          <ThemedLoadingIndicator
            size="large"
            fullScreen={true}
            message="Loading..."
          />
        )}
        {!isLoading && (
          <ThemedView
            style={{
              padding: 24,
              flex: 1,
              alignSelf: "center",
            }}
          >
            <AppLogo
              size={40}
              showMotto={false}
            />

            {validationMessage && (
              <ThemedText
                textStyleOptions={{ size: "small" }}
                textColorName="alarm"
                style={{
                  marginBottom: percentToDP(3),
                  marginLeft: percentToDP(1),
                  flexWrap: "wrap",
                  flexShrink: 1,
                }}
              >
                {validationMessage}
              </ThemedText>
            )}
            <ThemedTextField
              ref={nameRef}
              label="Title"
              autoComplete="name"
              onChangeText={(newText: string) => setName(newText)}
              autoFocus
              withValidation
              validate={[
                "required",
                (value) => (value ? value.length : 0) >= 3,
              ]}
              validationMessage={[
                "Name is required",
                "Name is too short (min. 3 characters)",
              ]}
              maxLength={250}
            />
            <ThemedTextField
              ref={emailRef}
              label="Description"
              autoComplete="email"
              onChangeText={(newText: string) => setEmail(newText)}
              withValidation
              validate={["required", "email"]}
              validationMessage={["Email is required", "Email is invalid"]}
              maxLength={250}
            />
            <ThemedTextField
              ref={repeatPasswordRef}
              label="Tags password"
              autoComplete="password-new"
              onChangeText={(newText: string) => setRepeatPassword(newText)}
              isSecret
              withValidation
              validate={["required", (value) => value === password]}
              validationMessage={[
                "Repeat password is required",
                "Passwords don't match",
              ]}
            />
            <ThemedTextField
              ref={passwordRef}
              label="Datetime"
              autoComplete="password-new"
              onChangeText={(newText: string) => setPassword(newText)}
              isSecret
              withValidation
              validate={[
                "required",
                (value) => (value ? value.length : 0) >= 8,
                (value) => (value?.match("passwordRegex")?.length ?? 0) > 0,
              ]}
              validationMessage={[
                "Password is required",
                "Password is too short (min. 8 characters)",
                "Password must have at least one each of: small letter, big letter, number, special character",
              ]}
            />
            <ThemedTextField
              ref={passwordRef}
              label="Location"
              autoComplete="password-new"
              onChangeText={(newText: string) => setPassword(newText)}
              isSecret
              withValidation
              validate={[
                "required",
                (value) => (value ? value.length : 0) >= 8,
                (value) => (value?.match("passwordRegex")?.length ?? 0) > 0,
              ]}
              validationMessage={[
                "Password is required",
                "Password is too short (min. 8 characters)",
                "Password must have at least one each of: small letter, big letter, number, special character",
              ]}
            />
            <HorizontalView
              justifyOption="flex-start"
              style={{
                marginLeft: percentToDP(0.4),
                marginBottom: percentToDP(8),
                marginTop: percentToDP(9),
              }}
            >
              <Checkbox
                label="I have read and accept "
                value={termsAgreedTo}
                onValueChange={(value) => setTermsAgreedTo(value)}
                color={accentColor}
                labelStyle={[{ color: textColor }, textStyle]}
              />
              <ThemedText
                textColorName="link"
                textStyleOptions={{ size: "small", weight: "bold" }}
                onPress={() => setDialogVisible(true)}
              >
                Terms of Use.
              </ThemedText>
            </HorizontalView>

            {isProcessing && !dialogVisible && (
              <ThemedLoadingIndicator
                size="large"
                style={{ marginBottom: percentToDP(14) }}
              />
            )}
            {(!isProcessing || dialogVisible) && (
              <ThemedButton
                style={{
                  marginBottom: percentToDP(6),
                }}
                backgroundColorName="primary"
                textColorName="textOnPrimary"
                label="Save"
                onPress={submit}
              />
            )}
          </ThemedView>
        )}
      </ThemedScrollView>
    </SafeAreaView>
  );
}
