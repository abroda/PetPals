import { Tabs, useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";

import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { useThemeColor } from "@/hooks/theme/useThemeColor";

export default function HomeLayout() {
  const backgroundColor = useThemeColor("tertiary");

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: {
          height: 0,
          shadowRadius: 0,
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          zIndex: 0,
          backgroundColor: backgroundColor,
          borderTopWidth: 0,
          borderTopStartRadius: 40,
          borderTopEndRadius: 40,
          position: "absolute",
        },
      }}
      sceneContainerStyle={{
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <ThemedIcon
              name={focused ? "home" : "home-outline"}
              colorName={focused ? "primary" : "link"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="walkStats"
        options={{
          title: "Walk Stats",
          tabBarIcon: ({ focused }) => (
            <ThemedIcon
              name={focused ? "stats-chart" : "stats-chart-outline"}
              colorName={focused ? "primary" : "link"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="activeWalk"
        options={{
          title: "Active Walk",
          tabBarIcon: ({ focused }) => (
            <ThemedIcon
              name={focused ? "walk" : "walk-outline"}
              colorName={focused ? "primary" : "link"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="groupWalks"
        options={{
          title: "Group Walks",
          tabBarIcon: ({ focused }) => (
            <ThemedIcon
              name={focused ? "calendar" : "calendar-outline"}
              colorName={focused ? "primary" : "link"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="socials"
        options={{
          title: "Socials",
          tabBarIcon: ({ focused }) => (
            <ThemedIcon
              name={focused ? "people" : "people-outline"}
              colorName={focused ? "primary" : "link"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
