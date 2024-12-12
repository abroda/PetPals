import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { Modal, Pressable, View } from "react-native";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { Href, router } from "expo-router";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { useColorScheme } from "@/hooks/theme/useColorScheme";
import { ThemeColors } from "@/constants/theme/Colors";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import React, { useState } from "react";
import TermsOfUseDialog from "@/components/dialogs/TermsOfUseDialog";
import VisibilitySettingDialog from "@/components/dialogs/VisibilitySettingDialog";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";

export default function AppSettings() {
  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];

  const { userProfile } = useUser();
  const { logout } = useAuth();
  const [visibilityModal, setVisibilityModal] = useState(false);

  const handleLogout = () => {
    logout();
    router.dismissAll();
    router.replace("/" as Href<string>);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedScrollView
        style={{ flex: 1, paddingTop: heighPercentToDP(10) }}
        colorName={"tertiary"}
      >
        <ThemedView colorName={"transparent"}>
          <ThemedText
            style={{
              paddingHorizontal: percentToDP(5),
              paddingVertical: percentToDP(3),
              fontSize: percentToDP(6),
            }}
            backgroundColorName={"transparent"}
          >
            Settings
          </ThemedText>
          <Pressable onPress={() => setVisibilityModal(true)}>
            <HorizontalView
              style={{
                paddingHorizontal: percentToDP(5),
                paddingVertical: percentToDP(3),
              }}
              colorName={"secondary"}
            >
              <HorizontalView colorName={"transparent"}>
                <ThemedIcon
                  name="eye"
                  colorName="text"
                  size={35}
                  style={{
                    backgroundColor: themeColors.accent,
                    borderRadius: 50,
                    padding: percentToDP(1),
                    marginRight: percentToDP(3),
                  }}
                />
                <ThemedText backgroundColorName={"transparent"}>
                  Visibility
                </ThemedText>
              </HorizontalView>
              <HorizontalView
                colorName={"transparent"}
                style={{ justifyContent: "center", gap: percentToDP(1) }}
              >
                <ThemedText
                  backgroundColorName={"transparent"}
                  textColorName={"placeholderText"}
                  style={{ fontSize: percentToDP(4) }}
                >
                  {userProfile?.visibility}
                </ThemedText>
                <ThemedIcon
                  name="chevron-forward-outline"
                  colorName="placeholderText"
                />
              </HorizontalView>
            </HorizontalView>
          </Pressable>
        </ThemedView>

        {visibilityModal && (
          <VisibilitySettingDialog
            onDismiss={() => setVisibilityModal(false)}
          />
        )}

        <ThemedView style={{ flex: 1, alignItems: "center" }}>
          <ThemedView
            style={{
              height: 3,
              marginVertical: percentToDP(5),
              width: percentToDP(80),
            }}
            colorName={"secondary"}
          ></ThemedView>
          <ThemedButton
            onPress={handleLogout}
            label="LOGOUT"
          />
        </ThemedView>
      </ThemedScrollView>
    </SafeAreaView>
  );
}
