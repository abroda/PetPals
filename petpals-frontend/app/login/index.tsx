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
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const { isLoading, isProcessing, login } = useAuth();
  const emailRef = useRef<TextFieldRef>(null);
  const passwordRef = useRef<TextFieldRef>(null);
  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");

  function validate() {
    return email.length > 0 && password.length > 0;
  }

  async function submit() {
    setValidationMessage("");
    if (!validate()) {
      if (password.length == 0) {
        setValidationMessage("Password is missing.");
      }

      if (email.length == 0) {
        setValidationMessage("Email is missing.");
      }
    } else {
      let result = await login(email, password);
      if (!result.success) {
        setValidationMessage(result.message);
      } else {
        setDialogVisible(false);
        router.dismissAll();
        router.replace("/home");
      }
    }
  }

  return (
    <SafeAreaView>
      <ThemedScrollView
        style={{
          height: heighPercentToDP(100),
          paddingTop: percentToDP(10),
        }}
      >
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
            <ThemedTextField
              ref={emailRef}
              label="Email"
              autoComplete="email"
              onChangeText={(newText: string) => setEmail(newText)}
              autoFocus
              withValidation
              validate={["required"]}
              validationMessage={["Email is required"]}
              maxLength={250}
            />
            <ThemedTextField
              ref={passwordRef}
              label="Password"
              autoComplete="password"
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
              style={{ marginBottom: percentToDP(21.3) }}
            >
              Forgot password?
            </ThemedText>
            {isProcessing && !dialogVisible && (
              <ThemedLoadingIndicator size="large" />
            )}
            {(!isProcessing || dialogVisible) && (
              <ThemedButton
                style={{
                  marginBottom: percentToDP(14),
                }}
                backgroundColorName="primary"
                textColorName="textOnPrimary"
                label="Login"
                onPress={submit}
              />
            )}
            {/* {(!isProcessing || dialogVisible) && (
            <ThemedButton
              style={{
                marginBottom: percentToDP(5),
              }}
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
    </SafeAreaView>
  );
}
