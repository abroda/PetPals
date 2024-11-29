import React, { useState } from "react";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedTextField } from "@/components/inputs/ThemedTextField";
import { ThemedText } from "@/components/basic/ThemedText";
import AppLogo from "@/components/decorations/static/AppLogo";
import { useAuth } from "@/hooks/useAuth";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { router } from "expo-router";
import validators from "react-native-ui-lib/src/components/textField/validators";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";

export default function RegisterSuccessScreen() {
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  return (
    <ThemedScrollView
      style={{ height: heightPercentToDP(100), paddingTop: percentToDP(10) }}
    >
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
        <ThemedText
          textStyleOptions={{ size: "big", weight: "bold" }}
          textColorName="primary"
          style={{
            marginTop: percentToDP(20),
            marginBottom: percentToDP(78),
            flexWrap: "wrap",
            flexShrink: 1,
            alignSelf: "center",
          }}
        >
          Registration succesful.
        </ThemedText>
        <ThemedButton
          style={{
            marginBottom: percentToDP(14),
          }}
          label="Go to Login"
          textColorName="textOnPrimary"
          onPress={() => {
            router.dismissAll();
            router.replace("/");
            router.push("/login");
          }}
        />
      </ThemedView>
    </ThemedScrollView>
  );
}
