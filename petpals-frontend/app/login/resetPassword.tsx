import React, { useState } from "react";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedTextField } from "@/components/inputs/ThemedTextField";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import AppLogo from "@/components/decorations/static/AppLogo";

export default function ResetPasswordScreen() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

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
        {!isConfirmed && (
          <ThemedTextField
            text60L
            label="Code"
            onChangeText={(newText: string) => setCode(newText)}
            withValidation
            validate={["required", (value) => (value ? value.length : 0) >= 6]}
            validationMessage={["Code is required", "Code is too short"]}
            maxLength={6}
          />
        )}
        {isConfirmed && (
          <ThemedTextField
            text60L
            label="Password"
            onChangeText={(newText: string) => setPassword(newText)}
            isSecret
            withValidation
            validate={["required", (value) => (value ? value.length : 0) > 6]}
            validationMessage={[
              "Field is required",
              "Password is too short",
              "Password is invalid",
            ]}
          />
        )}
        {isConfirmed && (
          <ThemedTextField
            text60L
            label="Repeat password"
            onChangeText={(newText: string) => setRepeatPassword(newText)}
            isSecret
            withValidation
            validate={["required", (value) => repeatPassword === password]}
            validationMessage={["Field is required", "Passwords don't match"]}
          />
        )}
        <ThemedButton onPress={() => {}}>Confirm</ThemedButton>
      </ThemedView>
    </ThemedScrollView>
  );
}
