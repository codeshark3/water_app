import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { getTests } from "@/db/queries";
import { tests as testsSchema } from "@/db/schema";
import Screen from "@/components/ui/Screen";
import TestCard from "@/components/TestCard";

import { Link } from "expo-router";
import { StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
// Add FAB component at the bottom of the screen
const FloatingActionButton = () => {
  return (
    <Link href="/tests/create" asChild>
      <Pressable style={styles.fab}>
        <Ionicons name="add" size={24} color="white" />
      </Pressable>
    </Link>
  );
};
type Test = typeof testsSchema.$inferSelect;

export default function TestsScreen() {
  const [tests, setTests] = useState<Test[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchTests = async () => {
    setRefreshing(true);
    const tests = await getTests();
    setTests(tests);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const filteredTests = searchText
    ? tests.filter(
        (test) =>
          test.name.toLowerCase().includes(searchText.toLowerCase()) ||
          test.participantId.toLowerCase().includes(searchText.toLowerCase())
      )
    : tests;

  return (
    <Screen>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Tests
      </Text>
      <View>
        <AppInput
          placeholder="Search tests..."
          onChangeText={setSearchText}
          style={{ marginBottom: 16 }}
        />
        <FlatList<Test>
          data={filteredTests}
          renderItem={({ item }) => <TestCard test={item} />}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={fetchTests}
          refreshing={refreshing}
          contentContainerStyle={{ padding: 16 }}
        />
      </View>
      <FloatingActionButton />
    </Screen>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
