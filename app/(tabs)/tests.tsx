import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { getTests } from "@/db/queries";
import { tests as testsSchema } from "@/db/schema";
import Screen from "@/components/ui/Screen";
import TestCard from "@/components/TestCard";

type Test = typeof testsSchema.$inferSelect;

export default function TestsScreen() {
  const [tests, setTests] = useState<Test[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTests = async () => {
    setRefreshing(true);
    const tests = await getTests();
    setTests(tests);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <Screen>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Tests
      </Text>
      <FlatList<Test>
        data={tests}
        renderItem={({ item }) => <TestCard test={item} />}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={fetchTests}
        refreshing={refreshing}
        contentContainerStyle={{ padding: 16 }}
      />
    </Screen>
  );
}
