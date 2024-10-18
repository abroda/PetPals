import React, { useState } from "react";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { ThemedTextField } from "@/components/inputs/ThemedTextField";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import AppLogo from "@/components/decorations/static/AppLogo";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import TermsOfUseDialog from "@/components/dialogs/TermsOfUseDialog";
import { Checkbox } from "react-native-ui-lib";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import validators from "react-native-ui-lib/src/components/textField/validators";
import { Pressable } from "react-native";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [termsAgreedTo, setTermsAgreedTo] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const { isLoading, responseMessage, passwordRegex, register } = useAuth();

  const accentColor = useThemeColor("accent");

  function validate() {
    return (
      name.length >= 3 &&
      email.length >= 6 &&
      validators.email(email) &&
      password.length >= 8 &&
      (password.match(passwordRegex)?.length ?? 0 >= 1) &&
      password === repeatPassword
    );
  }

  async function submit() {
    setValidationMessage("Processing request...");

    if (!validate()) {
      setValidationMessage("Input is invalid.");
    } else if (!termsAgreedTo) {
      setValidationMessage("You have to accept Terms of Use.");
    } else {
      register(name, email, password).then((result) => {
        if (!result) {
          setValidationMessage(responseMessage ?? "No response");
        } else {
          setValidationMessage("Registration successful");
          router.setParams({ email: email });
          router.push("./verifyEmail");
        }
      });
    }
  }

  return (
    <ThemedScrollView>
      {dialogVisible && (
        <TermsOfUseDialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
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
            label="Name"
            autoComplete="name"
            onChangeText={(newText: string) => setName(newText)}
            withValidation
            validate={["required", (value) => (value ? value.length : 0) >= 3]}
            validationMessage={["Name is required", "Name is too short"]}
            maxLength={250}
          />
          <ThemedTextField
            label="Email"
            autoComplete="email"
            onChangeText={(newText: string) => setEmail(newText)}
            withValidation
            validate={["required", "email"]}
            validationMessage={["Email is required", "Email is invalid"]}
            maxLength={250}
          />
          <ThemedTextField
            label="Password"
            onChangeText={(newText: string) => setPassword(newText)}
            isSecret
            withValidation
            validate={[
              "required",
              (value) => (value ? value.length : 0) >= 8,
              (value) => (password.match(passwordRegex)?.length ?? 0) > 0,
              (value) => password === repeatPassword,
            ]}
            validationMessage={[
              "Password is required",
              "Password is too short",
              "Password is invalid",
              "Passwords don't match",
            ]}
          />
          <ThemedTextField
            label="Repeat password"
            onChangeText={(newText: string) => setRepeatPassword(newText)}
            isSecret
            withValidation
            validate={["required", (value) => repeatPassword === password]}
            validationMessage={[
              "Repeat password is required",
              "Passwords don't match",
            ]}
          />
          <HorizontalView>
            <Checkbox
              label="I have read and accept "
              value={termsAgreedTo}
              onValueChange={(value) => setTermsAgreedTo(value)}
              color={accentColor}
              labelStyle={[
                { color: useThemeColor("text") },
                useTextStyle("small"),
              ]}
            />
            <ThemedText
              textColorName="link"
              textStyleName="smallBold"
              onPress={() => setDialogVisible(true)}
            >
              Terms of Use.
            </ThemedText>
          </HorizontalView>

          <ThemedButton
            marginB-15
            backgroundColorName="primary"
            textColorName="textOnPrimary"
            label="Register"
            onPress={submit}
          />
          <ThemedButton
            marginB-15
            backgroundColorName="secondary"
            textColorName="textOnSecondary"
            label="Go back"
            onPress={() => router.dismiss()}
          />
        </ThemedView>
      )}
    </ThemedScrollView>
  );
}
