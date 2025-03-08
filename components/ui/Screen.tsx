import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Screen({ children, style }: ScreenProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
