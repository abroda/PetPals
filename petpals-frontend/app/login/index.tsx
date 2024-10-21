import React, {
  ForwardedRef,
  forwardRef,
  LegacyRef,
  ReactElement,
  useRef,
  useState,
} from "react";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import AppLogo from "@/components/decorations/static/AppLogo";
import { ThemedText } from "@/components/basic/ThemedText";
import {
  ForwardedRefTextField,
  ThemedTextField,
} from "@/components/inputs/ThemedTextField";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import ResetPasswordDialog from "@/components/dialogs/ResetPasswordDialog";
import { TextField, TextFieldRef } from "react-native-ui-lib";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const { isLoading, isProcessing, responseMessage, passwordRegex, login } =
    useAuth();
  const emailRef = useRef<TextFieldRef>(null);
  const passwordRef = useRef<TextFieldRef>(null);

  function validate() {
    return email.length > 0 && password.length > 0;
  }

  async function submit() {
    if (!validate()) {
      setValidationMessage("Input is invalid.");
    } else {
      login(email, password).then((result) => {
        if (!result) {
          setValidationMessage(responseMessage ?? "Unknown error");
        } else {
          setDialogVisible(false);
          setValidationMessage("Login successful");
          router.dismissAll();
          router.replace("/home");
        }
      });
    }
  }

  return (
    <ThemedScrollView style={{ paddingTop: "0%" }}>
      {dialogVisible && (
        <ResetPasswordDialog
          onDismiss={() => setDialogVisible(false)}
          emailFilled={email}
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
            ref={emailRef}
            label="Email"
            autoComplete="email"
            onChangeText={(newText: string) => setEmail(newText)}
            withValidation
            validate={["required"]}
            validationMessage={["Email is required"]}
            maxLength={250}
          />
          <ThemedTextField
            ref={passwordRef}
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
            style={{ marginBottom: "15.5%" }}
          >
            Forgot password?
          </ThemedText>
          {isProcessing && !dialogVisible && (
            <ThemedLoadingIndicator size="large" />
          )}
          {(!isProcessing || dialogVisible) && (
            <ThemedButton
              marginT-72
              marginB-15
              backgroundColorName="primary"
              textColorName="textOnPrimary"
              label="Login"
              onPress={submit}
            />
          )}
          {/* {(!isProcessing || dialogVisible) && (
            <ThemedButton
              marginB-15
              backgroundColorName="secondary"
              textColorName="textOnSecondary"
              label="Go back"
              onPress={() => {
                router.canDismiss() ? router.dismiss() : router.push("/");
              }}
            />
          )} */}
        </ThemedView>
      )}
    </ThemedScrollView>
  );
}
