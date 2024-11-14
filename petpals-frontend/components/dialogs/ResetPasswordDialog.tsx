import { useEffect, useRef, useState } from "react";
import { ThemedText } from "../basic/ThemedText";
import { ThemedScrollView } from "../basic/containers/ThemedScrollView";
import { ThemedButton } from "../inputs/ThemedButton";
import { ThemedTextField } from "../inputs/ThemedTextField";
import HorizontalView from "../basic/containers/HorizontalView";
import { router } from "expo-router";
import ThemedDialog from "./ThemedDialog";
import validators from "react-native-ui-lib/src/components/textField/validators";
import { useAuth } from "@/hooks/useAuth";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import ThemedLoadingIndicator from "../decorations/animated/ThemedLoadingIndicator";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { TextFieldRef } from "react-native-ui-lib";

export default function ResetPasswordDialog({
  onDismiss = () => {},
  emailFilled = "",
}) {
  const [email, setEmail] = useState(emailFilled);
  const [validationMessage, setValidationMessage] = useState("");
  const { sendPasswordResetCode, isProcessing } = useAuth();

  const smallTheme = useTextStyle({ size: "small" });
  const alarmColor = useThemeColor("alarm");

  const percentToDP = useWindowDimension("shorter");

  const emailRef = useRef<TextFieldRef>(null);

  const asyncAbortController = useRef<AbortController | undefined>(undefined);
  useEffect(() => {
    asyncAbortController.current = new AbortController();
    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  function validate() {
    return emailRef.current?.validate();
  }

  async function submit() {
    setValidationMessage("");
    if (validate()) {
      let result = await sendPasswordResetCode(email);

      if (result.success) {
        router.push(`/login/resetPassword?email=${email}`);
        onDismiss();
      } else {
        setValidationMessage(result.returnValue);
        asyncAbortController.current = new AbortController();
      }
    }
  }

  return (
    <ThemedDialog onDismiss={onDismiss}>
      <ThemedScrollView
        style={{ padding: percentToDP(2), alignContent: "center" }}
      >
        <ThemedText
          textStyleOptions={{ size: "big", weight: "bold" }}
          style={{ marginBottom: percentToDP(4) }}
        >
          Reset password
        </ThemedText>

        <ThemedText style={{ marginBottom: percentToDP(4) }}>
          Please enter your email below and we will send you a code to reset
          your password.
        </ThemedText>

        {validationMessage && (
          <ThemedText
            textStyleOptions={{ size: "small" }}
            textColorName="alarm"
            style={{ marginBottom: percentToDP(3), marginLeft: percentToDP(1) }}
          >
            {validationMessage}
          </ThemedText>
        )}
        <ThemedTextField
          ref={emailRef}
          label="Email"
          autoComplete="email"
          value={email}
          onChangeText={(newText: string) => setEmail(newText)}
          autoFocus
          withValidation
          validate={["required", "email"]}
          validationMessage={["Email is required", "Email is invalid"]}
          maxLength={250}
          width={78}
        />
        {isProcessing && (
          <ThemedLoadingIndicator
            size="large"
            style={{
              marginVertical: percentToDP(1),
              alignSelf: "center",
            }}
          />
        )}
        {!isProcessing && (
          <HorizontalView>
            <ThemedButton
              label="Cancel"
              textColorName="textOnPrimary"
              style={{
                width: percentToDP(33),
                marginTop: percentToDP(3),
                marginBottom: percentToDP(2),
              }}
              onPress={onDismiss}
            />
            <ThemedButton
              label="Confirm"
              textColorName="textOnPrimary"
              style={{
                width: percentToDP(33),
                marginBottom: percentToDP(2),
              }}
              onPress={submit}
            />
          </HorizontalView>
        )}
      </ThemedScrollView>
    </ThemedDialog>
  );
}
