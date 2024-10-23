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
    responseMessage,
    resetPassword,
    sendPasswordResetCode,
    codeRegex,
  } = useAuth();

  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");

  function verify() {
    return (code.match(codeRegex)?.length ?? 0) > 0;
  }

  function submit() {
    if (verify()) {
      resetPassword(userEmail ?? "", password, code).then((result) => {
        result = true;
        if (result) {
          router.replace("/login");
        }
      });
    }
  }

  function resend() {
    sendPasswordResetCode(userEmail ?? "").then((result) => {
      setValidationMessage(responseMessage ?? "Error");
    });
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
                style={{ marginBottom: percentToDP(3) }}
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
                onChangeText={(newText: string) => setCode(newText)}
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
                onChangeText={(newText: string) => setRepeatPassword(newText)}
                isSecret
                withValidation
                validate={["required", (value) => repeatPassword === password]}
                validationMessage={[
                  "Field is required",
                  "Passwords don't match",
                ]}
              />
              <ThemedButton
                onPress={submit}
                label="Confirm"
                textColorName="textOnPrimary"
                style={{
                  marginTop: percentToDP(5),
                  marginBottom: percentToDP(5),
                }}
              />
              <ThemedButton
                onPress={resend}
                label="Resend code"
                textColorName="textOnSecondary"
                backgroundColorName="secondary"
                style={{ marginBottom: percentToDP(5) }}
              />
            </ThemedView>
          </ThemedView>
        )}
      </ThemedScrollView>
    </SafeAreaView>
  );
}
