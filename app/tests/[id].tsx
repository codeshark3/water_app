import { View, Text, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getTestById } from "~/db/queries";
import { tests } from "~/db/schema";
import Screen from "~/components/ui/Screen";
import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";
type Test = typeof tests.$inferSelect;
const getStatusColor = (status: string | null | undefined) => {
  switch (status) {
    case "synced":
      return "bg-green-200"; // Light green for synced
    case "error":
      return "bg-red-200"; // Light red for error
    case "in-progress":
      return "bg-yellow-200"; // Light yellow for syncing
    default:
      return "bg-gray-200"; // Default (pending)
  }
};
export default function TestDetails() {
  const { id } = useLocalSearchParams();
  const [test, setTest] = useState<Test | null>(null);

  useEffect(() => {
    const fetchTest = async () => {
      const result = await getTestById(Number(id));
      if (result.length > 0) {
        setTest(result[0]);
      }
    };
    fetchTest();
  }, [id]);

  if (!test) {
    return (
      <Screen>
        <Text>Loading...</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView>
        <Text className="text-2xl font-bold mb-5">Test Details</Text>

        <View className="gap-4">
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-base font-bold">Name</Text>
              <Text className="text-lg">{test.name}</Text>
            </View>

            <View className="flex-1">
              <Text className="text-base font-bold">Participant ID</Text>
              <Text className="text-lg">{test.participantId}</Text>
            </View>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-base font-bold">Age</Text>
              <Text className="text-lg">{test.age}</Text>
            </View>

            <View className="flex-1">
              <Text className="text-base font-bold">Gender</Text>
              <Text className="text-lg">{test.gender}</Text>
            </View>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-base font-bold">Location</Text>
              <Text className="text-lg">{test.location}</Text>
            </View>
            <View
              className={`flex-1 rounded-md px-2 py-1 text-center text-sm font-medium ${
                test.syncStatus === "synced"
                  ? "bg-emerald-500 text-white"
                  : test.syncStatus === "error"
                  ? "bg-red-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              <Text className="text-white">sync: {test.syncStatus}</Text>
            </View>
          </View>

          <View className="flex-row gap-4 justify-center items-center ">
            {test.onchoImage && (
              <View className="flex-1 px-1">
                <Text className="text-base font-bold">Oncho Image</Text>
                <Image
                  source={{ uri: test.onchoImage }}
                  className="w-[200px] h-[200px] mt-2"
                />
              </View>
            )}

            {test.schistoImage && (
              <View className="flex-1">
                <Text className="text-base font-bold">Schisto Image</Text>
                <Image
                  source={{ uri: test.schistoImage }}
                  className="w-[200px] h-[200px] mt-2"
                />
              </View>
            )}
          </View>

          <View className="flex-row gap-4">
            {test.lfImage && (
              <View className="flex-1">
                <Text className="text-base font-bold">LF Image</Text>
                <Image
                  source={{ uri: test.lfImage }}
                  className="w-[200px] h-[200px] mt-2"
                />
              </View>
            )}

            {test.helminthImage && (
              <View className="flex-1">
                <Text className="text-base font-bold">Helminth Image</Text>
                <Image
                  source={{ uri: test.helminthImage }}
                  className="w-[200px] h-[200px] mt-2"
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
