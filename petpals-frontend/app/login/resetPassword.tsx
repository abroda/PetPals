import React, { useEffect, useRef, useState } from "react";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedTextField } from "@/components/inputs/ThemedTextField";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import AppLogo from "@/components/decorations/static/AppLogo";
import { useAuth } from "@/hooks/useAuth";
import { Href, router, useLocalSearchParams } from "expo-router";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextFieldRef } from "react-native-ui-lib";

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const {
    isLoading,
    isProcessing,
    userEmail,
    passwordRegex,
    resetPassword,
    sendPasswordResetCode,
    codeRegex,
  } = useAuth();

  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");

  const codeRef = useRef<TextFieldRef>(null);
  const passwordRef = useRef<TextFieldRef>(null);
  const repeatPasswordRef = useRef<TextFieldRef>(null);

  const asyncAbortController = useRef<AbortController | undefined>(undefined);
  useEffect(() => {
    asyncAbortController.current = new AbortController();
    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  // update repeat password validation message on password change
  useEffect(() => {
    repeatPasswordRef.current?.validate();
  }, [password]);

  function verify() {
    let res = codeRef.current?.validate();
    res = passwordRef.current?.validate() && res;
    return repeatPasswordRef.current?.validate() && res;
  }

  async function submit() {
    setValidationMessage("");
    if (verify()) {
      let result = await resetPassword(email as string, password, code);

      if (result.success) {
        router.dismissAll();
        router.replace("/login/resetPasswordSuccess" as Href<string>);
      } else {
        setValidationMessage(result.returnValue);
        asyncAbortController.current = new AbortController();
      }
    }
  }

  async function resend() {
    setValidationMessage("");
    let result = await sendPasswordResetCode(email as string);
    setValidationMessage(result.returnValue);
    asyncAbortController.current = new AbortController();
  }

  return (
    <SafeAreaView>
      <ThemedScrollView style={{ paddingTop: percentToDP(10) }}>
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
                  flexWrap: "wrap",
                  flexShrink: 1,
                }}
              >
                {validationMessage}
              </ThemedText>
            )}
            <ThemedText
              textStyleOptions={{ size: "big", weight: "bold" }}
              style={{ marginBottom: percentToDP(3) }}
            >
              Reset password
            </ThemedText>
            <ThemedText style={{ marginBottom: percentToDP(10) }}>
              Please enter a verification code and set a new password.
            </ThemedText>
            <ThemedTextField
              ref={codeRef}
              label="Code"
              autoComplete="one-time-code"
              onChangeText={(newText: string) => setCode(newText)}
              autoFocus
              withValidation
              validate={[
                "required",
                (value) => (value?.match(codeRegex)?.length ?? 0) > 0,
              ]}
              validationMessage={["Code is required", "Code is too short"]}
              maxLength={6}
            />
            <ThemedTextField
              ref={passwordRef}
              label="Password"
              autoComplete="password-new"
              onChangeText={(newText: string) => setPassword(newText)}
              isSecret
              withValidation
              validate={[
                "required",
                (value) => (value ? value.length : 0) > 6,
                (value) => (value?.match(passwordRegex)?.length ?? 0) > 0,
              ]}
              validationMessage={[
                "Password is required",
                "Password is too short (min. 8 characters)",
                "Password must have at least one each of: small letter, big letter, number, special character",
              ]}
            />
            <ThemedTextField
              ref={repeatPasswordRef}
              label="Repeat password"
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
            {isProcessing && <ThemedLoadingIndicator size="large" />}
            {!isProcessing && (
              <ThemedButton
                onPress={submit}
                label="Confirm"
                textColorName="textOnPrimary"
                style={{
                  marginTop: percentToDP(5),
                  marginBottom: percentToDP(5),
                }}
              />
            )}
            {!isProcessing && (
              <ThemedButton
                onPress={resend}
                label="Resend code"
                textColorName="textOnSecondary"
                backgroundColorName="secondary"
                style={{ marginBottom: percentToDP(14) }}
              />
            )}
          </ThemedView>
        )}
      </ThemedScrollView>
    </SafeAreaView>
  );
}
