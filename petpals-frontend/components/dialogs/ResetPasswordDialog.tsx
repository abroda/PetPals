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
import { Modal } from "react-native";

export default function ResetPasswordDialog({
  visible = false,
  onCancel = () => {},
  emailFilled = "",
}) {
  const [email, setEmail] = useState(emailFilled);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onCancel}
    >
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
          padding: "auto",
          backgroundColor: "#00000088",
          backfaceVisibility: "hidden",
        }}
      >
        <ThemedView
          style={{
            margin: "5%",
            padding: "4%",
            paddingBottom: "1%",
            borderRadius: 30,
          }}
        >
          <ThemedScrollView style={{ padding: "2%" }}>
            <ThemedText
              textStyleName="header"
              style={{ marginBottom: "4%" }}
            >
              Reset password
            </ThemedText>

            <ThemedText style={{ marginBottom: "4%" }}>
              Please enter your email below and we will send you a code to reset
              your password.
            </ThemedText>
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
            <HorizontalView>
              <ThemedButton
                label="Cancel"
                textColorName="textOnPrimary"
                style={{ width: "30%", marginRight: "40%" }}
                onPress={onCancel}
              />
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
      </ThemedView>
    </Modal>
  );
}
