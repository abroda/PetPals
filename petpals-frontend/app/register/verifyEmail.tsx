import React, { useState } from "react";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedTextField } from "@/components/inputs/ThemedTextField";
import { ThemedText } from "@/components/basic/ThemedText";
import AppLogo from "@/components/decorations/static/AppLogo";
import { useAuth } from "@/hooks/useAuth";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { router } from "expo-router";
import validators from "react-native-ui-lib/src/components/textField/validators";
import { useWindowDimension } from "@/hooks/useWindowDimension";

export default function VerifyEmailScreen() {
  const [code, setCode] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const {
    isLoading,
    isProcessing,
    codeRegex,
    userEmail,
    responseMessage,
    verifyEmail,
    resendVerification,
  } = useAuth();

  const percentToDP = useWindowDimension("shorter");

  function verify() {
    return (code.match(codeRegex)?.length ?? 0) > 0;
  }

  function submit() {
    if (verify()) {
      verifyEmail(userEmail ?? "", code).then((result) => {
        result = true;
        result
          ? router.push("/login")
          : setValidationMessage(responseMessage ?? "Error");
      });
    }
  }

  function resend() {
    resendVerification(userEmail ?? "").then((result) =>
      setValidationMessage(responseMessage ?? "Error")
    );
  }

  return (
    <ThemedScrollView style={{ padding: percentToDP(5) }}>
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
              Verify email
            </ThemedText>
            <ThemedText style={{ marginBottom: percentToDP(10) }}>
              Please enter verification code to finish registration.
            </ThemedText>
            <ThemedTextField
              label="Code"
              onChangeText={(newText: string) => setCode(newText)}
              withValidation
              validate={[
                "required",
                (value) => (value?.match(codeRegex)?.length ?? 0) > 0,
              ]}
              validationMessage={["Code is required", "Code is invalid"]}
              maxLength={6}
            />
            {!isLoading && (
              <ThemedView style={{ width: "100%", marginTop: percentToDP(22) }}>
                <ThemedButton
                  marginB-15
                  label="Confirm"
                  textColorName="textOnPrimary"
                  onPress={submit}
                />
                <ThemedButton
                  marginB-15
                  backgroundColorName="secondary"
                  textColorName="textOnSecondary"
                  label="Resend Code"
                  onPress={resend}
                />
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>
      )}
    </ThemedScrollView>
  );
}
