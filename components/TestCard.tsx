import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { tests } from "~/db/schema";
import { useRouter } from "expo-router";

type Test = typeof tests.$inferSelect;

interface TestCardProps {
  test: Test;
}

export default function TestCard({ test }: TestCardProps) {
  const router = useRouter();
  const { id } = test;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push({
          pathname: "/tests/[id]",
          params: { id },
        });
      }}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{test.name}</Text>
        <Text style={styles.id}>ID: {test.participantId}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.detail}>Age: {test.age}</Text>
        <Text style={styles.detail}>Gender: {test.gender}</Text>
        <Text style={styles.detail}>{test.syncStatus}</Text>
        <Text style={styles.detail}>Location: {test.location}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  id: {
    fontSize: 14,
    color: "#666",
  },
  details: {
    gap: 4,
  },
  detail: {
    fontSize: 14,
    color: "#444",
  },
});
