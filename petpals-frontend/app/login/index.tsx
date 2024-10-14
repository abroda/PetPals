import React, { useState } from "react";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import ThemedLoadingIndicator from "@/components/displays/ThemedLoadingIndicator";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import AppLogo from "@/components/decorations/static/AppLogo";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedTextField } from "@/components/inputs/ThemedTextField";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import ResetPasswordDialog from "@/components/dialogs/ResetPasswordDialog";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const { isLoading, responseMessage, login } = useAuth();

  const alarmColor = useThemeColor("alarm");

  function validate() {}

  async function submit() {
    setValidationMessage("Processing request...");

    await login(email, password);

    if (responseMessage !== "OK") {
      setValidationMessage(responseMessage ?? "No response");
    } else {
      setValidationMessage("Login successful");
      router.replace("../home");
    }
  }

  return (
    <ThemedScrollView
      paddingH-25
      paddingT-30
    >
      {isLoading ? (
        <ThemedLoadingIndicator />
      ) : (
        <ThemedView
          style={{
            padding: 24,
            flex: 1,
            justifyContent: "center",
          }}
        >
          <AppLogo
            size={20}
            showMotto={false}
          />

          {validationMessage && (
            <ThemedText
              textStyleName="label"
              center={false}
              textColorName="alarm"
              style={{ marginBottom: "3%" }}
            >
              {validationMessage}
            </ThemedText>
          )}
          <ThemedTextField
            text60L
            label="Email"
            onChangeText={(newText: string) => setEmail(newText)}
            enableErrors
            validationMessageStyle={{ color: alarmColor }}
            validate={[
              "required",
              "email",
              (value) => (value ? value.length : 0) > 6,
            ]}
            validateOnBlur
            validationMessage={[
              "Field is required",
              "Email is invalid",
              "Email is too short",
            ]}
            maxLength={250}
          />
          <ThemedTextField
            text60L
            label="Password"
            onChangeText={(newText: string) => setPassword(newText)}
            secureTextEntry
            validateOnChange
            validationMessageStyle={{ color: alarmColor }}
            showCharCounter
            enableErrors
            validate={["required", (value) => (value ? value.length : 0) > 6]}
            validationMessage={[
              "Field is required",
              "Password is too short",
              "Password is invalid",
            ]}
          />

          <ThemedText
            center={false}
            textColorName="link"
            textStyleName="small"
            onPress={() => setDialogVisible(true)}
            style={{ marginBottom: "20%" }}
          >
            Forgot password?
          </ThemedText>
          <ThemedButton
            marginB-15
            backgroundColorName="primary"
            textColorName="textOnPrimary"
            label="Login"
            onPress={submit}
          />
          <ThemedButton
            marginB-15
            backgroundColorName="secondary"
            textColorName="textOnSecondary"
            label="Go back"
            onPress={() => router.dismiss()}
          />

          <ThemedView>
            <ResetPasswordDialog
              visible={dialogVisible}
              onDismiss={() => setDialogVisible(false)}
            />
          </ThemedView>
        </ThemedView>
      )}
    </ThemedScrollView>
  );
}
