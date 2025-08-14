import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { BottomTabs, TabParamList } from "./BottomTabs";

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
};


const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,         // Header tamamilə silinir
        contentStyle: { paddingTop: 0 }, // Safe area boşluğu silinir
      }}

    >
      {/* Bütün tab-lar */}
      <Stack.Screen
        name="Tabs"
        component={BottomTabs}
        options={{ headerShown: false }}
      />


    </Stack.Navigator>
  );
}
