import {
  DarkTheme,
  DefaultTheme,
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
import HomeLayout from "./home/_layout";
import { PostProvider } from "@/context/PostContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from "@/context/UserContext";
import { Provider as PaperProvider } from 'react-native-paper';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts(assetsFonts);
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      <PaperProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthProvider>
            <UserProvider>
                <PostProvider>

                        <Stack
                            screenOptions={{
                                headerShown: true,
                                headerShadowVisible: false,
                                headerTransparent: true,
                                headerTintColor: 'white',
                                headerTitle: "",
                                headerBackVisible: true,
                                headerBackTitleVisible: false,

                            }}
                        >
                            <Stack.Screen
                                name="index"
                                options={{ title: "PetPals" }}
                            />
                            <Stack.Screen name="+not-found" />
                        </Stack>

                </PostProvider>
            </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
      </PaperProvider>
  );
}
