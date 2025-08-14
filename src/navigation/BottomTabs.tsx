import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, Platform } from 'react-native';

import FavoritesScreen from '../screens/FavoritesScreen';
import HomeScreen from '../screens/HomeScreen';
import { useThemeStore } from '../store/useThemeStore';
import { useFavoritesStore } from '../store/useFavoritesStore';

export type TabParamList = {
  Home: undefined;
  Favorites: undefined;
};
const heart = require('../assets/heart.png');
const heartOutline = require('../assets/heart-outline.png');
const home = require('../assets/home-icon.png');
const homeOutline = require('../assets/home-otline.png');
const Tab = createBottomTabNavigator<TabParamList>();

export function BottomTabs() {
  const { theme } = useThemeStore();
  const { favorites } = useFavoritesStore();
  const isDark = theme === "dark";
  const favoriteCount = favorites.length;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: Platform.OS === 'ios' ? 'absolute' : 'relative',
          borderTopWidth: 0,
          elevation: 0,
          height: 70,
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
          borderTopColor: isDark ? '#333333' : '#e1e1e1',
          shadowColor: isDark ? '#000000' : '#000000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: isDark ? '#ff6b6b' : '#f92c46',
        tabBarInactiveTintColor: isDark ? '#888888' : '#666666',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },

      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Image source={focused ? home : homeOutline} tintColor={color} width={30} height={20} style={{ width: 24, height: 24 }} />
          ),

        }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color, focused }) => (
            <Image source={focused ? heart : heartOutline} tintColor={color} width={30} height={30} style={{ width: 30, height: 30 }} />
          ),
          // Show favorite count as badge
          tabBarBadge: favoriteCount > 0 ? favoriteCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: isDark ? '#ff4757' : '#f92c46',
            color: '#ffffff',
            fontSize: 10,
            fontWeight: '600',
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            marginLeft: 4,
          },
        }}
      />
    </Tab.Navigator>
  );
}