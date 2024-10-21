import { useState } from "react";
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

export default function ResetPasswordDialog({
  onDismiss = () => {},
  emailFilled = "",
}) {
  const [email, setEmail] = useState(emailFilled);
  const [showResponse, setShowResponse] = useState(false);
  const { requestPasswordReset, responseMessage, isProcessing } = useAuth();

  const smallTheme = useTextStyle("small");
  const alarmColor = useThemeColor("alarm");

  function validate() {
    return validators.email(email);
  }

  function submit() {
    if (validate()) {
      requestPasswordReset(email).then((result) => {
        if (result) {
          setShowResponse(false);
          router.setParams({ email: email });
          router.push("./resetPassword");
          onDismiss();
        } else {
          setShowResponse(true);
        }
      });
    }
  }

  return (
    <ThemedDialog onDismiss={onDismiss}>
      <ThemedScrollView style={{ padding: "2%" }}>
        <ThemedText
          textStyleName="bigBold"
          style={{ marginBottom: "4%" }}
        >
          Reset password
        </ThemedText>

        <ThemedText style={{ marginBottom: "4%" }}>
          Please enter your email below and we will send you a code to reset
          your password.
        </ThemedText>

        {showResponse && (
          <ThemedText
            style={[smallTheme, { color: alarmColor, marginBottom: 10 }]}
          >
            {responseMessage}
          </ThemedText>
        )}
        <ThemedTextField
          text60L
          marginB-20
          label="Email"
          value={email}
          onChangeText={(newText: string) => setEmail(newText)}
          autoFocus
          withValidation
          validate={["required", "email"]}
          validationMessage={["Field is required", "Email is invalid"]}
          maxLength={250}
        />
        {isProcessing && (
          <ThemedLoadingIndicator
            size="large"
            style={{ padding: "5%" }}
          />
        )}
        {!isProcessing && (
          <HorizontalView>
            <ThemedButton
              label="Cancel"
              textColorName="textOnPrimary"
              style={{ width: "30%", marginBottom: "2%" }}
              onPress={onDismiss}
            />
            <ThemedButton
              label="Confirm"
              textColorName="textOnPrimary"
              style={{
                width: "30%",
                marginBottom: "2%",
              }}
              onPress={submit}
            />
          </HorizontalView>
        )}
      </ThemedScrollView>
    </ThemedDialog>
  );
}
