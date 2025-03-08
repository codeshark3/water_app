// app/(tabs)/upload.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { syncPendingTests } from "@/services/sync";
import { db } from "@/db/drizzle";
import { tests } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import Screen from "@/components/ui/Screen";
import { checkConnectivity } from "@/utils/network";
import * as Progress from "react-native-progress";

export default function UploadScreen() {
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [totalTests, setTotalTests] = useState(0);
  const [syncedTests, setSyncedTests] = useState(0);

  const startSync = async () => {
    const isConnected = await checkConnectivity();
    if (!isConnected) {
      setStatus("No internet connection");
      return;
    }

    try {
      setSyncing(true);
      setStatus("Starting sync...");
      setProgress(0);
      setSyncedTests(0);

      // Get pending tests
      const pendingTests = await db
        .select()
        .from(tests)
        .where(
          or(eq(tests.syncStatus, "pending"), eq(tests.syncStatus, "failed"))
        );

      setTotalTests(pendingTests.length);

      if (pendingTests.length === 0) {
        setStatus("No pending tests to sync");
        setSyncing(false);
        return;
      }

      for (const [index, test] of pendingTests.entries()) {
        try {
          setStatus(`Syncing test ${index + 1} of ${pendingTests.length}`);

          // Replace with your actual API endpoint
          const response = await fetch("YOUR_API_ENDPOINT", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(test),
          });

          if (response.ok) {
            await db
              .update(tests)
              .set({ syncStatus: "synced" })
              .where(eq(tests.id, test.id));

            setSyncedTests((prev) => prev + 1);
          } else {
            await db
              .update(tests)
              .set({ syncStatus: "failed" })
              .where(eq(tests.id, test.id));
          }

          // Update progress
          const newProgress = (index + 1) / pendingTests.length;
          setProgress(newProgress);
        } catch (error) {
          await db
            .update(tests)
            .set({ syncStatus: "failed" })
            .where(eq(tests.id, test.id));
        }
      }

      setStatus(`Sync complete. ${syncedTests} of ${totalTests} tests synced.`);
    } catch (error) {
      setStatus("Sync failed. Please try again.");
      console.error("Sync error:", error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Upload Tests</Text>

        <View style={styles.card}>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{status}</Text>
            {syncing && (
              <Text style={styles.countText}>
                {syncedTests} of {totalTests} tests synced
              </Text>
            )}
          </View>

          <View style={styles.progressContainer}>
            <Progress.Bar
              progress={progress}
              width={null}
              height={8}
              color="#007AFF"
              borderRadius={4}
              style={styles.progressBar}
            />
          </View>

          <Pressable
            style={[styles.button, syncing && styles.buttonDisabled]}
            onPress={startSync}
            disabled={syncing}
          >
            <Text style={styles.buttonText}>
              {syncing ? "Syncing..." : "Start Sync"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 8,
  },
  countText: {
    fontSize: 14,
    color: "#666",
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    width: "100%",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
