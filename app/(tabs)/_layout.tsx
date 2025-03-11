import { Tabs, Redirect } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuthStore();
  if (!user) {
    return <Redirect href="/login" />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        //tabBarBackground:>,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />{" "}
      <Tabs.Screen
        name="tests"
        options={{
          title: "Tests",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="test-tube" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",

          tabBarIcon: ({ color }) => (
            <FontAwesome size={30} name="cloud-upload" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
