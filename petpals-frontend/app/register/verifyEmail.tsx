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

export default function VerifyEmailScreen(email: string) {
  const [code, setCode] = useState("");
  const { isLoading, isProcessing, verifyEmail, resendVerification } =
    useAuth();

  const codeRegex = "^[0-9]{6}$";

  const alarmColor = useThemeColor("alarm");

  function verify() {
    return (code.match(codeRegex)?.length ?? 0) > 0;
  }

  function submit() {
    if (verify()) {
      verifyEmail(email, code).then((result) => {
        if (result) {
          router.push("../../login");
        }
      });
    }
  }

  function resend() {
    resendVerification(email).then((result) => {
      if (result) {
        router.push("../../login");
      }
    });
  }

  return (
    <ThemedScrollView
      paddingH-25
      paddingT-30
    >
      <AppLogo
        size={20}
        showMotto={false}
      />

      <ThemedView style={{ padding: "5%" }}>
        <ThemedText
          textStyleName="bigBold"
          style={{ marginBottom: "3%" }}
        >
          Verify email
        </ThemedText>
        <ThemedText style={{ marginBottom: "10%" }}>
          Please, enter verification code to finish registration.
        </ThemedText>
        <ThemedTextField
          text60L
          label="Code"
          onChangeText={(newText: string) => setCode(newText)}
          enableErrors
          validate={[
            "required",
            (value) => (value?.match(codeRegex)?.length ?? 0) > 0,
          ]}
          validateOnBlur
          validationMessageStyle={{ color: alarmColor }}
          validationMessage={["Code is required", "Code is invalid"]}
          maxLength={6}
        />
        {!isLoading && (
          <ThemedView style={{ width: "100%", marginTop: "23%" }}>
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
    </ThemedScrollView>
  );
}
