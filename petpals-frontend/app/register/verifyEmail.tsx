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

export default function VerifyEmailScreen(email: string) {
  const [code, setCode] = useState("");
  const { verifyEmail, resendVerification } = useAuth();

  const verify = () => {
    verifyEmail(email, code);

    if (true) {
      router.push("../../login");
    }
  };

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
          textStyleName="header"
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
          validate={["required", (value) => (value ? value.length : 0) >= 6]}
          validateOnBlur
          validationMessageStyle={{ color: useThemeColor("alarm") }}
          validationMessage={["Code is required", "Code is too short"]}
          maxLength={6}
        />
        <ThemedButton onPress={verify}>Confirm</ThemedButton>
        <ThemedButton onPress={resendVerification}>Resend code</ThemedButton>
      </ThemedView>
    </ThemedScrollView>
  );
}
