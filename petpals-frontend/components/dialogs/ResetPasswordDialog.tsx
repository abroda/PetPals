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
import { useWindowDimension } from "@/hooks/useWindowDimension";

export default function ResetPasswordDialog({
  onDismiss = () => {},
  emailFilled = "",
}) {
  const [email, setEmail] = useState(emailFilled);
  const [validationMessage, setValidationMessage] = useState("");
  const { sendPasswordResetCode, isProcessing } = useAuth();

  const smallTheme = useTextStyle("small");
  const alarmColor = useThemeColor("alarm");

  const percentToDP = useWindowDimension("shorter");

  function validate() {
    return validators.email(email);
  }

  async function submit() {
    if (validate()) {
      let result = await sendPasswordResetCode(email);
      if (result.success) {
        router.setParams({ email: email });
        router.push("./resetPassword");
        onDismiss();
      } else {
        setValidationMessage(result.message);
      }
    }
  }

  return (
    <ThemedDialog onDismiss={onDismiss}>
      <ThemedScrollView
        style={{ padding: percentToDP(2), alignContent: "center" }}
      >
        <ThemedText
          textStyleName="bigBold"
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
            textStyleName="small"
            textColorName="alarm"
            style={{ marginBottom: percentToDP(3) }}
          >
            {validationMessage}
          </ThemedText>
        )}
        <ThemedTextField
          label="Email"
          autoComplete="email"
          value={email}
          onChangeText={(newText: string) => setEmail(newText)}
          autoFocus
          withValidation
          validate={["required", "email"]}
          validationMessage={["Field is required", "Email is invalid"]}
          maxLength={250}
          width={78}
        />
        {isProcessing && (
          <ThemedLoadingIndicator
            size="large"
            style={{ padding: percentToDP(5) }}
          />
        )}
        {!isProcessing && (
          <HorizontalView>
            <ThemedButton
              label="Cancel"
              textColorName="textOnPrimary"
              style={{ width: percentToDP(33), marginBottom: percentToDP(2) }}
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
