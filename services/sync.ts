import { db } from "~/db/drizzle";
import { tests } from "~/db/schema";
import { eq, or } from "drizzle-orm";
import { checkConnectivity } from "~/utils/network";
import * as FileSystem from 'expo-file-system';

// Replace with your actual API endpoint
const API_ENDPOINT = "http://192.168.2.153:5328/api/python";

type TestData = typeof tests.$inferInsert;

const convertImageToBase64 = async (uri: string | null): Promise<string | null> => {
  if (!uri) return null;
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
};

export const uploadTest = async (testData: TestData) => {
  const isConnected = await checkConnectivity();

  if (!isConnected) {
    // Save locally with pending status
    await db.insert(tests).values({
      ...testData,
      syncStatus: "pending",
    });
    return { success: true, offline: true };
  }

  try {
    // Convert images to base64
    const [onchoBase64, schistoBase64, lfBase64, helminthBase64] = await Promise.all([
      convertImageToBase64(testData.onchoImage ?? null),
      convertImageToBase64(testData.schistoImage ?? null),
      convertImageToBase64(testData.lfImage ?? null),
      convertImageToBase64(testData.helminthImage ?? null),
    ]);

    const processedTestData = {
      participantId: testData.participantId,
      name: testData.name,
      age: testData.age,
      gender: testData.gender,
      location: testData.location,
      createdAt: testData.createdAt,
      createdBy: testData.createdBy,
      onchoImage: onchoBase64,
      schistoImage: schistoBase64,
      lfImage: lfBase64,
      helminthImage: helminthBase64,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(processedTestData),
      signal: controller.signal,
    }).catch(error => {
      console.error("Network error:", error);
      throw new Error("Network request failed. Please check your connection and try again.");
    });
    clearTimeout(timeoutId);

    const responseData = await response.json();
    console.log("Upload response:", responseData);

    if (response.ok) {
      // Save locally with synced status
      await db.insert(tests).values({
        ...testData,
        syncStatus: "synced",
      });
      return { success: true, offline: false };
    } else {
      // Save locally with failed status
      await db.insert(tests).values({
        ...testData,
        syncStatus: "failed",
      });
      return { success: false, offline: false };
    }
  } catch (error) {
    console.log("Upload error:", error);
    // Save locally with failed status
    await db.insert(tests).values({
      ...testData,
      syncStatus: "failed",
    });
    return { success: false, offline: false };
  }
};

export const syncPendingTests = async () => {
  try {
    const pendingTests = await db
      .select()
      .from(tests)
      .where(or(eq(tests.syncStatus, "pending"), eq(tests.syncStatus, "failed")));

    for (const test of pendingTests) {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(test),
        });

        const responseData = await response.json();
        console.log("Sync response for test", test.id, ":", responseData);

        if (response.ok) {
          await db
            .update(tests)
            .set({ syncStatus: "synced" })
            .where(eq(tests.id, test.id));
        } else {
          await db
            .update(tests)
            .set({ syncStatus: "failed" })
            .where(eq(tests.id, test.id));
        }
      } catch (error) {
        console.log("Sync error for test", test.id, ":", error);
        await db
          .update(tests)
          .set({ syncStatus: "failed" })
          .where(eq(tests.id, test.id));
      }
    }
  } catch (error) {
    console.error("Sync error:", error);
  }
};
