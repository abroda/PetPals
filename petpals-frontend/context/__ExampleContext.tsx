import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState, ReactNode, FC } from "react";

export type ExampleContextType = {
  theme: string;
  switchTheme: () => void;
};

export const ExampleContext = createContext<ExampleContextType | null>(null);

export const __ExampleProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState("light");

  async function readTheme() {
    try {
      const chosenTheme = await AsyncStorage.getItem("theme");
      console.log(
        "ThemeProvider.readTheme: chosenTheme = " + (chosenTheme ?? "null")
      );

      if (chosenTheme) {
        setTheme(chosenTheme);
      }
    } catch (err) {
      console.log(
        "ThemeProvider.readTheme: Reading value of chosenTheme caused an exception."
      );
    }
  }

  async function switchTheme() {
    readTheme();
    if (theme == "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }

    AsyncStorage.setItem("theme", theme);
  }

  useEffect(() => {
    readTheme();
  });

  return (
    <ExampleContext.Provider value={{ theme, switchTheme }}>
      {children}
    </ExampleContext.Provider>
  );
};
