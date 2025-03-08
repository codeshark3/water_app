import React, { useEffect, useState } from "react";
import { View, ViewStyle, StyleSheet, SafeAreaView } from "react-native";
import OfflineBar from "@/components/OfflineNotice";
import Constants from "expo-constants";
import { checkConnectivity } from "@/utils/network";

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Screen({ children, style }: ScreenProps) {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <View style={[styles.view, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 15,
  },
  view: {
    flex: 1,
  },
});
