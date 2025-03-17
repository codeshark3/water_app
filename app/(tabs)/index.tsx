import { Link } from "expo-router";
import { Text, View } from "react-native";
import Screen from "~/components/ui/Screen";
import { getLocalTestCount, getUploadedTestCount } from "~/db/queries";
import { useState, useEffect } from "react";
import { MoonStar } from "~/lib/icons/MoonStar";
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
        <Text className="text-2xl font-bold mb-4">Dashboard</Text>

        <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
          <View className="flex-1 bg-white p-4 rounded-lg shadow">
            <Text className="text-3xl font-bold text-[#007AFF]">
              {localTestCount}
            </Text>
            <Text className="text-[#666]">Stored Tests</Text>
          </View>

          <View className="flex-1 bg-white p-4 rounded-lg shadow">
            <Text className="text-3xl font-bold text-[#34C759]">
              {uploadedTestCount}
            </Text>
            <Text className="text-[#666]">Uploaded Tests</Text>
          </View>
        </View>

        <Link
          href="/tests"
          style={{
            backgroundColor: "#007AFF",
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
            flexDirection: "row",
            gap: 8,
            justifyContent: "center",
          }}
          className="bg-[#007AFF] p-4 rounded-lg items-center flex-row gap-2 justify-center"
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            View All Tests
          </Text>
        </Link>

        <MoonStar className="border-4 border-red-500" />
      </View>
    </Screen>
  );
}
