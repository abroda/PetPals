import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/theme/useColorScheme";
import { assetsFonts } from "@/constants/theme/TextStyles";
import { AuthProvider } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { PostProvider } from "@/context/PostContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WalksProvider } from "@/context/WalksContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts(assetsFonts);
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const headerStyle = useTextStyle({ size: "big", weight: "bold" });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <PostProvider>
            <WalksProvider>
              <Stack
                screenOptions={{
                  headerShown: true,
                  headerShadowVisible: false,
                  headerTransparent: true,
                  headerTintColor: textColor,
                  headerStyle: { backgroundColor: backgroundColor },
                  headerTitle: "",
                  headerBackVisible: true,
                  headerBackTitleVisible: false,
                  headerTitleStyle: {
                    fontFamily: headerStyle.fontFamily,
                    fontWeight: headerStyle.fontWeight,
                    fontSize: headerStyle.fontSize,
                  },
                }}
              >
                <Stack.Screen
                  name="index"
                  options={{ title: "PetPals" }}
                />
                <Stack.Screen name="+not-found" />
              </Stack>
            </WalksProvider>
          </PostProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
