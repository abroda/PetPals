import React, { useState } from "react";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import AppLogo from "@/components/decorations/static/AppLogo";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedTextField } from "@/components/inputs/ThemedTextField";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import ResetPasswordDialog from "@/components/dialogs/ResetPasswordDialog";
import { Pressable } from "react-native";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const { isLoading, isProcessing, responseMessage, passwordRegex, login } =
    useAuth();

  function validate() {
    return email.length > 0 && password.length > 0;
  }

  async function submit() {
    if (!validate()) {
      setValidationMessage("Input is invalid.");
      return;
    }

    login(email, password).then((result) => {
      if (!result) {
        setValidationMessage(responseMessage ?? "Unknown error");
      } else {
        setValidationMessage("Login successful");
        router.replace("../home");
      }
    });
  }

  return (
    <ThemedScrollView>
      {dialogVisible && (
        <ResetPasswordDialog
          visible={dialogVisible}
          onCancel={() => setDialogVisible(false)}
        />
      )}
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
            justifyContent: "center",
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
              style={{ marginBottom: "3%" }}
            >
              {validationMessage}
            </ThemedText>
          )}
          <ThemedTextField
            label="Email"
            autoComplete="email"
            onChangeText={(newText: string) => setEmail(newText)}
            withValidation
            validate={["required"]}
            validationMessage={["Email is required"]}
            maxLength={250}
          />
          <ThemedTextField
            label="Password"
            autoComplete="current-password"
            onChangeText={(newText: string) => setPassword(newText)}
            isSecret
            withValidation
            validate={["required"]}
            validationMessage={["Password is required"]}
          />

          <ThemedText
            textColorName="link"
            textStyleName="small"
            onPress={() => setDialogVisible(true)}
            style={{ marginBottom: "20%" }}
          >
            Forgot password?
          </ThemedText>
          {isProcessing && <ThemedLoadingIndicator size="large" />}
          {!isProcessing && (
            <ThemedButton
              marginB-15
              backgroundColorName="primary"
              textColorName="textOnPrimary"
              label="Login"
              onPress={submit}
            />
          )}
          {!isProcessing && (
            <ThemedButton
              marginB-15
              backgroundColorName="secondary"
              textColorName="textOnSecondary"
              label="Go back"
              onPress={() => {
                router.canDismiss() ? router.dismiss() : router.push("/");
              }}
            />
          )}
        </ThemedView>
      )}
    </ThemedScrollView>
  );
}
