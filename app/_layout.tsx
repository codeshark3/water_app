import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "~/drizzle/migrations";
import { Stack } from "expo-router";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect, useMemo } from "react";
import { ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import OfflineNotice from "~/components/OfflineNotice";
import { PortalHost } from "@rn-primitives/portal";
import { syncPendingTests } from "~/services/sync";
import { checkConnectivity } from "~/utils/network";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

import {
  Theme,
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import * as React from "react";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { Sun } from "~/lib/icons/Sun";
import { View, TouchableOpacity } from "react-native";

import "~/global.css";
import { MoonStar } from "~/lib/icons/MoonStar";
export const DATABASE_NAME = "water";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme, setColorScheme } = useColorScheme();
  const [theme, setTheme] = React.useState(
    isDarkColorScheme ? DARK_THEME : LIGHT_THEME
  );

  SplashScreen.preventAutoHideAsync();
  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }
    hasMounted.current = true;
  }, []);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    setTheme(isDarkColorScheme ? DARK_THEME : LIGHT_THEME);
  }, [isDarkColorScheme]);

  const toggleColorScheme = () => {
    setColorScheme(isDarkColorScheme ? "light" : "dark");
  };

  // useEffect(() => {
  //   // Subscribe to network state changes
  //   const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
  //     if (state.isConnected && state.isInternetReachable) {
  //       // Try to sync when we get online
  //       syncPendingTests();
  //     }
  //   });

  //   // Initial sync attempt
  //   checkConnectivity().then((isConnected: boolean) => {
  //     if (isConnected) {
  //       syncPendingTests();
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  if (!loaded) {
    return null;
  }

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense={true}
      >
        <ThemeProvider value={theme}>
          <Suspense fallback={<ActivityIndicator size="large" />}>
            <OfflineNotice />
          </Suspense>

          <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <View className="absolute right-5 bottom-5 w-14 h-14 items-center justify-center bg-blue-500 rounded-full shadow-lg">
            <TouchableOpacity
              onPress={toggleColorScheme}
              className="w-full h-full items-center justify-center"
            >
              {isDarkColorScheme ? (
                <Sun color="white" />
              ) : (
                <MoonStar color="white" />
              )}
            </TouchableOpacity>
          </View>
        </ThemeProvider>
      </SQLiteProvider>
      <PortalHost name="modal" />
    </Suspense>
  );
}
