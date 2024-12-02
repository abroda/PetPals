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
import HomeLayout from "./home/_layout";
import { PostProvider } from "@/context/PostContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from "@/context/UserContext";
import { Provider as PaperProvider } from "react-native-paper";
import { DogProvider } from "@/context/DogContext";
import { FriendshipProvider } from "@/context/FriendshipContext";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { WalksProvider } from "@/context/WalksContext";
import { useTextStyle } from "@/hooks/theme/useTextStyle";

SplashScreen.preventAutoHideAsync();

// Colours
const darkGreen = "#0A2421";
const lightGreen = "#1C302A";
const accentGreen = "#B4D779";
const accentTeal = "#52B8A3";
const cream = "#FAF7EA";

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
    <PaperProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DarkTheme}>
          <AuthProvider>
            <UserProvider>
              <PostProvider>
                <WalksProvider>
                  <DogProvider>
                    <FriendshipProvider>
                    <Stack
                      screenOptions={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerTransparent: true,
                        headerTintColor: textColor,
                        headerStyle: { backgroundColor: backgroundColor },
                        // headerTransparent: false, // Changed background color
                        // headerStyle: {
                        //     backgroundColor: lightGreen, // Changed background color
                        // },
                        // headerTintColor: cream, // Set icon and text color
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
                    </FriendshipProvider>
                  </DogProvider>
                </WalksProvider>
              </PostProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
