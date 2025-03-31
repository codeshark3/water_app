import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { tests } from "~/db/schema";
import { useRouter, useNavigation } from "expo-router";
import { Card } from "~/components/ui/card";

type Test = typeof tests.$inferSelect;

interface TestCardProps {
  test: Test;
}
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
export default function TestCard({ test }: TestCardProps) {
  const router = useRouter();
  const { id } = test;

  return (
    <TouchableOpacity
      className="mb-3"
      onPress={() => {
        router.push({
          pathname: "/tests/[id]",
          params: { id },
        });
        router.push(`/tests/${id}`);
      }}
    >
      <Card className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold">{test.name}</Text>
          <Text className="text-md text-gray-500">
            ID: {test.participantId}
          </Text>
        </View>
        <View className="gap-1">
          {test.syncStatus ? (
            <Text className="text-md text-gray-700">
              sync: {test.syncStatus}
            </Text>
          ) : (
            <Text className="text-md text-gray-700">sync: pending</Text>
          )}

          <Text className="text-md text-gray-700">
            Location: {test.location}
          </Text>
        </View>
        <View
          className={`gap-1 p-2 rounded ${getStatusColor(test.syncStatus)}`}
        >
          <Text className="text-md text-red-700">
            sync: {test.syncStatus || "pending"}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
