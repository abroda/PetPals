import React, { useState } from "react";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedTextField } from "@/components/inputs/ThemedTextField";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import AppLogo from "@/components/decorations/static/AppLogo";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordScreen() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const {
    isLoading,
    isProcessing,
    userEmail,
    resetPassword,
    sendPasswordResetCode,
    codeRegex,
  } = useAuth();

  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");

  function verify() {
    return (code.match(codeRegex)?.length ?? 0) > 0;
  }

  async function submit() {
    if (verify()) {
      let result = await resetPassword(userEmail ?? "", password, code);
      if (result.success) {
        router.replace("/login");
      } else {
        setValidationMessage(result.message);
      }
    }
  }

  async function resend() {
    let result = await sendPasswordResetCode(userEmail ?? "");
    if (result.success) {
      setValidationMessage(result.message);
    }
  }

  return (
    <SafeAreaView>
      {" "}
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
              size={20}
              showMotto={false}
            />
            {validationMessage && (
              <ThemedText
                textStyleName="small"
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
            <ThemedView style={{ padding: percentToDP(5) }}>
              <ThemedText
                textStyleName="bigBold"
                style={{ marginBottom: percentToDP(3) }}
              >
                Reset password
              </ThemedText>
              <ThemedText style={{ marginBottom: percentToDP(10) }}>
                Please enter a verification code and set a new password.
              </ThemedText>
              <ThemedTextField
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
                label="Password"
                autoComplete="password-new"
                onChangeText={(newText: string) => setPassword(newText)}
                isSecret
                withValidation
                validate={[
                  "required",
                  (value) => (value ? value.length : 0) > 6,
                ]}
                validationMessage={[
                  "Field is required",
                  "Password is too short",
                  "Password is invalid",
                ]}
              />
              <ThemedTextField
                label="Repeat password"
                autoComplete="password-new"
                onChangeText={(newText: string) => setRepeatPassword(newText)}
                isSecret
                withValidation
                validate={["required", (value) => repeatPassword === password]}
                validationMessage={[
                  "Field is required",
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
                  style={{ marginBottom: percentToDP(5) }}
                />
              )}
            </ThemedView>
          </ThemedView>
        )}
      </ThemedScrollView>
    </SafeAreaView>
  );
}
