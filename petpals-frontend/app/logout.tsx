import React, { useEffect } from "react";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { useAuth } from "@/hooks/useAuth";
import { ThemedText } from "@/components/basic/ThemedText";
import { router } from "expo-router";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { ThemedView } from "@/components/basic/containers/ThemedView";

export default function LogoutScreen() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <ThemedScrollView
      style={{
        height: "100%",
      }}
    >
      <ThemedView
        style={{
          height: "100%",
          flex: 1,
          paddingTop: "50%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemedText style={{ marginBottom: 40 }}>Goodbye!</ThemedText>
        <ThemedButton
          style={{ width: "90%" }}
          onPress={() => {
            router.dismissAll();
            router.push("/");
          }}
        >
          Go to Main Page
        </ThemedButton>
      </ThemedView>
    </ThemedScrollView>
  );
}
