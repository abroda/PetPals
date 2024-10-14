import React, { useState } from "react";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { ThemedTextField } from "@/components/inputs/ThemedTextField";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import AppLogo from "@/components/decorations/static/AppLogo";
import ThemedLoadingIndicator from "@/components/displays/ThemedLoadingIndicator";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import TermsOfUseDialog from "@/components/dialogs/TermsOfUseDialog";
import { Checkbox } from "react-native-ui-lib";
import { useTextStyle } from "@/hooks/theme/useTextStyle";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [termsAgreedTo, setTermsAgreedTo] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const { isLoading, responseMessage, register } = useAuth();

  const alarmColor = useThemeColor("alarm");
  const accentColor = useThemeColor("accent");

  async function submit() {
    setValidationMessage("Processing request...");

    await register(name, email, password);

    if (responseMessage !== "OK") {
      setValidationMessage(responseMessage ?? "No response");
    } else {
      setValidationMessage("Registration successful");
      router.setParams({ email: email });
      router.push("./verifyEmail");
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
            label="Name"
            onChangeText={(newText: string) => setName(newText)}
            enableErrors
            validate={["required", (value) => (value ? value.length : 0) > 2]}
            validateOnBlur
            validationMessage={["Name is required", "Name is too short"]}
            maxLength={250}
          />
          <ThemedTextField
            text60L
            label="Email"
            onChangeText={(newText: string) => setEmail(newText)}
            enableErrors
            validationMessageStyle={{ color: useThemeColor("alarm") }}
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
            validationMessageStyle={{ color: useThemeColor("alarm") }}
            showCharCounter
            enableErrors
            validate={["required", (value) => (value ? value.length : 0) > 6]}
            validationMessage={[
              "Field is required",
              "Password is too short",
              "Password is invalid",
            ]}
          />
          <ThemedTextField
            text60L
            label="Repeat password"
            onChangeText={(newText: string) => setRepeatPassword(newText)}
            secureTextEntry
            validateOnChange
            showCharCounter
            enableErrors
            validate={["required", (value) => repeatPassword == password]}
            validationMessage={["Field is required", "Passwords don't match"]}
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
            ></Checkbox>
            ,
            <ThemedText
              textColorName="link"
              textStyleName="smallBold"
              onPress={() => setDialogVisible(true)}
            >
              Terms of Use
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

          <TermsOfUseDialog
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}
          />
        </ThemedView>
      )}
    </ThemedScrollView>
  );
}
