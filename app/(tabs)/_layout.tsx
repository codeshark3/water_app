import { Tabs, Redirect } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "~/components/HapticTab";
import { useColorScheme } from "~/lib/useColorScheme";

import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthStore } from "~/store/useAuthStore";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuthStore();
  if (!user) {
    return <Redirect href="/login" />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:
          colorScheme.colorScheme === "dark" ? "#fff" : "#007AFF",
        tabBarInactiveTintColor:
          colorScheme.colorScheme === "dark" ? "#9BA1A6" : "#687076",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
            height: 90,
            paddingBottom: 20,
          },
          default: {
            backgroundColor:
              colorScheme.colorScheme === "dark" ? "#151718" : "#FFFFFA",
            borderTopColor:
              colorScheme.colorScheme === "dark" ? "#2D2D2D" : "#E5E5E5",
            borderTopWidth: 1,
            height: 65,
            paddingBottom: 10,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 2,
        },
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
          headerShown: false,
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
