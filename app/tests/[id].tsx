import { View, Text, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getTestById } from "@/db/queries";
import { tests } from "@/db/schema";
import Screen from "@/components/ui/Screen";
import { useState, useEffect } from "react";

type Test = typeof tests.$inferSelect;

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
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          Test Details
        </Text>

        <View style={{ gap: 16 }}>
          <View>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Name</Text>
            <Text style={{ fontSize: 18 }}>{test.name}</Text>
          </View>

          <View>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Participant ID
            </Text>
            <Text style={{ fontSize: 18 }}>{test.participantId}</Text>
          </View>

          <View>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Age</Text>
            <Text style={{ fontSize: 18 }}>{test.age}</Text>
          </View>

          <View>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Gender</Text>
            <Text style={{ fontSize: 18 }}>{test.gender}</Text>
          </View>

          <View>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Location</Text>
            <Text style={{ fontSize: 18 }}>{test.location}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Sync Status
            </Text>
            <Text style={{ fontSize: 18 }}>{test.syncStatus}</Text>
          </View>

          {test.onchoImage && (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Oncho Image
              </Text>
              <Image
                source={{ uri: test.onchoImage }}
                style={{ width: 200, height: 200, marginTop: 8 }}
              />
            </View>
          )}

          {test.schistoImage && (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Schisto Image
              </Text>
              <Image
                source={{ uri: test.schistoImage }}
                style={{ width: 200, height: 200, marginTop: 8 }}
              />
            </View>
          )}

          {test.lfImage && (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>LF Image</Text>
              <Image
                source={{ uri: test.lfImage }}
                style={{ width: 200, height: 200, marginTop: 8 }}
              />
            </View>
          )}

          {test.helminthImage && (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Helminth Image
              </Text>
              <Image
                source={{ uri: test.helminthImage }}
                style={{ width: 200, height: 200, marginTop: 8 }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
