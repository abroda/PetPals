import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { ScrollViewStyleReset } from "expo-router/html";
import React, { type PropsWithChildren } from "react";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * This file is web-only and used to configure the root HTML for every web page during static rendering.
 * The contents of this function only run in Node.js environments and do not have access to the DOM or browser APIs.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <title>PetPals</title>
        <meta
          name="description"
          content="Social app for pet owners."
        />
        <meta
          name="keywords"
          content="pets, social, petpals, pet pals, walks, group walks"
        />
        <meta
          name="author"
          content="PetPals dev team"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <meta charSet="utf-8" />
        <meta
          httpEquiv="X-UA-Compatible"
          content="IE=edge"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <ScrollViewStyleReset />
      </head>
      <body>
        {Platform.OS == "ios" ? (
          <SafeAreaView>{children}</SafeAreaView>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
