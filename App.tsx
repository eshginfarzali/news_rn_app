import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import { useThemeStore } from "./src/store/useThemeStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RootNavigator } from "./src/navigation/RootNavigator";

const queryClient = new QueryClient();

// Custom themes for navigation
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#f92c46',
    background: '#ffffff',
    card: '#ffffff',
    text: '#000000',
    border: '#e1e1e1',
    notification: '#ff6b6b',
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#ff6b6b',
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    border: '#333333',
    notification: '#ff4757',
  },
};

export default function App() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {/* StatusBar configuration based on theme */}
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={isDark ? '#121212' : '#ffffff'}
          translucent={false}
        />

        <NavigationContainer theme={isDark ? CustomDarkTheme : CustomLightTheme}>
          <RootNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}