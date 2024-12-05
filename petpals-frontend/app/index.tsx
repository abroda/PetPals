import AppLogo from "@/components/decorations/static/AppLogo";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { useAuth } from "@/hooks/useAuth";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { router, useNavigation } from "expo-router";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { useEffect, useLayoutEffect } from "react";
import "react-native-get-random-values";
import {widthPercentageToDP} from "react-native-responsive-screen";
import themeContext from "@react-navigation/native/src/theming/ThemeContext";
import { useColorScheme } from "@/hooks/theme/useColorScheme";
import { ThemeColors } from "@/constants/theme/Colors";

export default function WelcomeScreen() {
  const { isLoading, isProcessing, userId, authToken } = useAuth();

  // Styling
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];

  useEffect(() => {
    if (!isLoading && !isProcessing && userId && authToken) {
      router.replace("/home");
    }
  }, []);

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView
      style={{ flex: 1, margin: 0, padding: 0, backgroundColor: themeColors.tertiary}}
      edges={["left", "right", "bottom"]}
    >
      <ThemedScrollView
        style={{
          height: heightPercentToDP(100),
          paddingTop: percentToDP(15),
        }}
      >
        {isLoading && (
          <ThemedLoadingIndicator
            size="large"
            message="Loading..."
            fullScreen={true}
            style={{ alignSelf: "center" }}
          />
        )}
        {!isLoading && (
          <ThemedView
            style={{
              alignSelf: "center",
              flex: 1,
            }}
          >
            <AppLogo
              size={80}
              showName={!isLoading}
              showMotto={!isLoading}
            />
            <HorizontalView>
              <ThemedButton
                style={{ marginBottom: percentToDP(5), width: percentToDP(43) }}
                textColorName="textOnPrimary"
                label="Home Screen"
                onPress={() => router.push("/home")}
              />
              <ThemedButton
                style={{ marginBottom: percentToDP(5), width: percentToDP(43) }}
                label="Login"
                textColorName="textOnPrimary"
                onPress={() => router.push("/login")}
              />
            </HorizontalView>
            <ThemedButton
              style={{ marginBottom: percentToDP(5) }}
              backgroundColorName="secondary"
              textColorName="textOnSecondary"
              label="Register"
              onPress={() => router.push("/register")}
            />
          </ThemedView>
        )}
      </ThemedScrollView>
    </SafeAreaView>
  );
}
