import { useState } from "react";
import { Dialog, PanningProvider } from "react-native-ui-lib";
import { ThemedText } from "../basic/ThemedText";
import { ThemedScrollView } from "../basic/containers/ThemedScrollView";
import { ThemedButton } from "../inputs/ThemedButton";
import { ThemedTextField } from "../inputs/ThemedTextField";
import { ThemedView } from "../basic/containers/ThemedView";
import HorizontalView from "../basic/containers/HorizontalView";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { router } from "expo-router";

export default function ResetPasswordDialog({
  visible = false,
  onDismiss = () => {},
  emailFilled = "",
}) {
  const [email, setEmail] = useState(emailFilled);

  return (
    <ThemedView>
      <Dialog
        visible={visible}
        ignoreBackgroundPress
        onDismiss={onDismiss}
        panDirection={PanningProvider.Directions.DOWN}
        containerStyle={{}}
      >
        <ThemedView style={{ padding: "4%", borderRadius: 30 }}>
          <ThemedScrollView style={{ padding: "2%" }}>
            <ThemedText
              center={false}
              textStyleName="header"
              style={{ marginBottom: "4%" }}
            >
              Reset password
            </ThemedText>

            <ThemedText
              center={false}
              style={{ marginBottom: "4%" }}
            >
              Please enter your email below and we will send you a code to reset
              your password.
            </ThemedText>
            <ThemedTextField
              text60L
              marginB-20
              label="Email"
              value={email}
              onChangeText={(newText: string) => setEmail(newText)}
              enableErrors
              autoFocus
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
            <HorizontalView>
              <ThemedButton
                label="Cancel"
                textColorName="textOnPrimary"
                style={{ width: "30%", marginRight: "39%" }}
                onPress={onDismiss}
              />
              ,
              <ThemedButton
                label="Confirm"
                textColorName="textOnPrimary"
                style={{ width: "30%" }}
                onPress={() => {
                  router.setParams({ email: email });
                  router.push("./resetPassword");
                }}
              />
            </HorizontalView>
          </ThemedScrollView>
        </ThemedView>
      </Dialog>
    </ThemedView>
  );
}
