import AppLogo from "@/components/decorations/static/AppLogo";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { useAuth } from "@/hooks/useAuth";
import ThemedLoadingIndicator from "@/components/displays/ThemedLoadingIndicator";
import { Dimensions } from "react-native";
import { isLoading } from "expo-font";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { router } from "expo-router";
import { ThemedText } from "@/components/basic/ThemedText";

export default function WelcomeScreen() {
  const { isLoading, responseMessage, authToken } = useAuth();

  if (!isLoading && authToken) {
    router.replace("./home");
  }

  return (
    <ThemedScrollView>
      {isLoading && <ThemedLoadingIndicator />}
      {!isLoading && (
        <AppLogo
          size={45}
          showName={!isLoading}
          showMotto={!isLoading}
        />
      )}

      {!isLoading && (
        <ThemedView style={{ width: "100%", padding: "5%" }}>
          <ThemedButton
            marginB-15
            label="Login"
            textColorName="textOnPrimary"
            onPress={() => router.push("./login")}
          />
          <ThemedButton
            marginB-15
            backgroundColorName="secondary"
            textColorName="textOnSecondary"
            label="Register"
            onPress={() => router.push("./register")}
          />
        </ThemedView>
      )}
      {!isLoading && responseMessage !== "" && (
        <ThemedView style={{ width: "100%", padding: "5%" }}>
          <ThemedText textColorName="alarm">
            Error: No connection to database
          </ThemedText>
        </ThemedView>
      )}
    </ThemedScrollView>
  );
}
