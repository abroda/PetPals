import React, { useEffect, useRef, useState } from "react";
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
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";
import { TextFieldRef } from "react-native-ui-lib";

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
  const heightPercentToDP = useWindowDimension("height");

  const emailRef = useRef<TextFieldRef>(null);
  const codeRef = useRef<TextFieldRef>(null);

  const asyncAbortController = useRef<AbortController | undefined>(undefined);
  useEffect(() => {
    asyncAbortController.current = new AbortController();
    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  function verify() {
    let res = codeRef.current?.validate();
    return emailRef.current?.validate() && res;
  }

  async function submit() {
    setValidationMessage("");
    if (verify()) {
      let result = await verifyEmail(email, code);

      if (result.success) {
        router.dismissAll();
        router.replace("/register/success");
      } else {
        setValidationMessage(result.returnValue);
        asyncAbortController.current = new AbortController();
      }
    }
  }

  async function resend() {
    setValidationMessage("");
    if (emailRef.current?.validate()) {
      let result = await resendVerification(email);
      setValidationMessage(result.returnValue);
      asyncAbortController.current = new AbortController();
    }
  }

  return (
    <ThemedScrollView
      style={{ height: heightPercentToDP(100), paddingTop: percentToDP(10) }}
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
            Verify email
          </ThemedText>
          <ThemedText style={{ marginBottom: percentToDP(10) }}>
            Please enter verification code to finish registration.
          </ThemedText>
          <ThemedTextField
            ref={emailRef}
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
            ref={codeRef}
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
