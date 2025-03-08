import { drizzle } from "drizzle-orm/expo-sqlite";
import { Stack } from "expo-router";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import { syncPendingTests } from "@/services/sync";
import { checkConnectivity } from "@/utils/network";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import OfflineNotice from "@/components/OfflineNotice";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
export const DATABASE_NAME = "water";

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      if (state.isConnected && state.isInternetReachable) {
        // Try to sync when we get online
        syncPendingTests();
      }
    });

    // Initial sync attempt
    checkConnectivity().then((isConnected: boolean) => {
      if (isConnected) {
        syncPendingTests();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <OfflineNotice />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </SQLiteProvider>
    </Suspense>
  );
}
