import { Link } from "expo-router";
import { Text, View } from "react-native";
import Screen from "@/components/ui/Screen";
import { getLocalTestCount, getUploadedTestCount } from "@/db/queries";
import { useState, useEffect } from "react";
export default function Index() {
  const [localTestCount, setLocalTestCount] = useState(0);
  const [uploadedTestCount, setUploadedTestCount] = useState(0);
  useEffect(() => {
    getLocalTestCount().then(setLocalTestCount);
    getUploadedTestCount().then(setUploadedTestCount);
  }, []);
  return (
    <Screen>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
          Dashboard
        </Text>

        <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text
              style={{ fontSize: 32, fontWeight: "bold", color: "#007AFF" }}
            >
              {localTestCount}
            </Text>
            <Text style={{ color: "#666" }}>Stored Tests</Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text
              style={{ fontSize: 32, fontWeight: "bold", color: "#34C759" }}
            >
              {uploadedTestCount}
            </Text>
            <Text style={{ color: "#666" }}>Uploaded Tests</Text>
          </View>
        </View>

        <Link
          href="/tests"
          style={{
            backgroundColor: "#007AFF",
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            View All Tests
          </Text>
        </Link>
      </View>
    </Screen>
  );
}
