import { db } from "~/db/drizzle";
import { tests } from "~/db/schema";
import { eq } from "drizzle-orm";
import { checkConnectivity } from "~/utils/network";

// Replace with your actual API endpoint
const API_ENDPOINT = "https://your-api.com/tests";

type TestData = typeof tests.$inferInsert;

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
    // Try to upload to server
    // Replace with your actual API endpoint
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

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
      .where(eq(tests.syncStatus, "pending"));

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
