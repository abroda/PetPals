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
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";

export default function VerifyEmailScreen() {
  const [code, setCode] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const {
    isLoading,
    isProcessing,
    codeRegex,
    userEmail,
    verifyEmail,
    resendVerification,
  } = useAuth();
  const [email, setEmail] = useState(userEmail ?? "");

  const percentToDP = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");

  function verify() {
    return (
      (code.match(codeRegex)?.length ?? 0) > 0 && validators.email(email ?? "")
    );
  }

  async function submit() {
    setValidationMessage("");
    if (!verify()) {
      setValidationMessage("Input is invalid.");
    } else {
      let result = await verifyEmail(email, code);
      if (result.success) {
        router.push("/login");
      } else {
        setValidationMessage(result.message);
      }
    }
  }

  async function resend() {
    setValidationMessage("");
    if (!validators.email(email)) {
      setValidationMessage("Invalid email.");
    } else {
      let result = await resendVerification(email);
      if (result.success) {
        setValidationMessage(result.message);
      }
    }
  }

  return (
    <ThemedScrollView
      style={{ height: heightPercentToPD(100), paddingTop: percentToDP(10) }}
    >
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
            label="Email"
            autoComplete="email"
            value={email}
            onChangeText={(newText: string) => setEmail(newText)}
            autoFocus
            withValidation
            validate={["required", "email"]}
            validationMessage={["Email is required", "Email is invalid"]}
            maxLength={250}
          />
          <ThemedTextField
            label="Code"
            autoComplete="one-time-code"
            onChangeText={(newText: string) => setCode(newText)}
            withValidation
            validate={[
              "required",
              (value) => (value?.match(codeRegex)?.length ?? 0) > 0,
            ]}
            validationMessage={["Code is required", "Code is invalid"]}
            maxLength={6}
          />
          {isProcessing && <ThemedLoadingIndicator size="large" />}
          {!isProcessing && (
            <ThemedView
              style={{ marginTop: percentToDP(15), alignSelf: "center" }}
            >
              <ThemedButton
                style={{
                  marginBottom: percentToDP(5),
                }}
                label="Confirm"
                textColorName="textOnPrimary"
                onPress={submit}
              />
              <ThemedButton
                style={{
                  marginBottom: percentToDP(14),
                }}
                backgroundColorName="secondary"
                textColorName="textOnSecondary"
                label="Resend Code"
                onPress={resend}
              />
            </ThemedView>
          )}
        </ThemedView>
      )}
    </ThemedScrollView>
  );
}
