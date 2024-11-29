import React, {
  ForwardedRef,
  forwardRef,
  LegacyRef,
  ReactElement,
  useEffect,
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
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);

  // Colours
  const darkGreen = "#0A2421";
  const lightGreen = "#1C302A";
  const accentGreen = "#B4D779";
  const accentTeal = "#52B8A3";
  const cream = "#FAF7EA";

  const { isLoading, isProcessing, login } = useAuth();

  const emailRef = useRef<TextFieldRef>(null);
  const passwordRef = useRef<TextFieldRef>(null);

  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");

  const asyncAbortController = useRef<AbortController | undefined>(undefined);
  useEffect(() => {
    asyncAbortController.current = new AbortController();
    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  function validate() {
    let res = emailRef.current?.validate();
    return passwordRef.current?.validate() && res;
  }

  async function submit() {
    setValidationMessage("");

    if (validate()) {
      let result = await login(email, password, asyncAbortController.current);

      if (result.success) {
        setDialogVisible(false);
        router.dismissAll();
        router.replace("/home");
      } else {
        setValidationMessage(result.returnValue);
        asyncAbortController.current = new AbortController();
      }
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, margin: 0, padding: 0, backgroundColor: lightGreen }}
      edges={["left", "right", "bottom"]}
    >
      <ThemedScrollView
        style={{
          flex: 1,
          margin: 0,

          padding: 0,
          paddingTop: percentToDP(15),
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
              textStyleOptions={{ size: "small" }}
              onPress={() => setDialogVisible(true)}
              style={{
                marginBottom: percentToDP(21.3),
                marginLeft: percentToDP(1),
              }}
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
          </ThemedView>
        )}
      </ThemedScrollView>
    </SafeAreaView>
  );
}
