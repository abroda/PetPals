import { Tabs } from "expo-router";
import React from "react";

import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { ThemeColors } from "@/constants/theme/Colors";
import { useColorScheme } from "@/hooks/theme/useColorScheme";
import { useThemeColor } from "@/hooks/theme/useThemeColor";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ThemeColors[colorScheme ?? "light"].icon,
        headerShown: false,
      }}
      sceneContainerStyle={{ backgroundColor: useThemeColor("background") }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <ThemedIcon name={focused ? "home" : "home-outline"} />
          ),
        }}
      />
      <Tabs.Screen
        name="walks"
        options={{
          title: "Walks",
          tabBarIcon: ({ color, focused }) => (
            <ThemedIcon
              name={focused ? "walk" : "walk-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color, focused }) => (
            <ThemedIcon
              name={focused ? "people" : "people-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: "AI chat",
          tabBarIcon: ({ color, focused }) => (
            <ThemedIcon
              name={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
