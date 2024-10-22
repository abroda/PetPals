import AppLogo from "@/components/decorations/static/AppLogo";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { useAuth } from "@/hooks/useAuth";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { router } from "expo-router";
import { ThemedText } from "@/components/basic/ThemedText";
import { useWindowDimension } from "@/hooks/useWindowDimension";

export default function WelcomeScreen() {
  const { isLoading, responseMessage, authToken } = useAuth();
  const percentToDP = useWindowDimension("shorter");

  if (!isLoading && authToken) {
    router.replace("./home");
  }

  return (
    <ThemedScrollView style={{ paddingTop: percentToDP(20) }}>
      {isLoading && (
        <ThemedLoadingIndicator
          size="large"
          message="Loading..."
          fullScreen={true}
        />
      )}
      {!isLoading && (
        <ThemedView
          style={{
            alignSelf: "center",
          }}
        >
          <AppLogo
            size={40}
            showName={!isLoading}
            showMotto={!isLoading}
          />
          <ThemedButton
            style={{ marginBottom: percentToDP(5) }}
            backgroundColorName="secondary"
            textColorName="textOnSecondary"
            label="Skip to Home"
            onPress={() => router.push("./home")}
          />
          <ThemedButton
            style={{ marginBottom: percentToDP(5) }}
            label="Login"
            textColorName="textOnPrimary"
            onPress={() => router.push("./login")}
          />
          <ThemedButton
            style={{ marginBottom: percentToDP(5) }}
            backgroundColorName="secondary"
            textColorName="textOnSecondary"
            label="Register"
            onPress={() => router.push("./register")}
          />
        </ThemedView>
      )}
      {/* {!isLoading && responseMessage !== "" && (
        <ThemedView
          style={{ width: percentToDP(100), padding: percentToDP(5) }}
        >
          <ThemedText textColorName="alarm">
            Error: No connection to database
          </ThemedText>
        </ThemedView>
      )} */}
    </ThemedScrollView>
  );
}
