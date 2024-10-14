import React, { useEffect } from "react";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { useAuth } from "@/hooks/useAuth";
import { ThemedText } from "@/components/basic/ThemedText";
import { router } from "expo-router";
import { ThemedButton } from "@/components/inputs/ThemedButton";

export default function LogoutScreen() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <ThemedScrollView
      paddingH-25
      paddingT-30
    >
      <ThemedText>Goodbye!</ThemedText>
      <ThemedButton
        onPress={() => {
          router.dismissAll();
          router.push("/");
        }}
      >
        Main Page
      </ThemedButton>
    </ThemedScrollView>
  );
}
