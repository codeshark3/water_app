import { db } from "@/db/drizzle";
import { tests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkConnectivity } from "@/utils/network";

// Replace with your actual API endpoint
const API_ENDPOINT = "https://your-api.com/tests";

export async function uploadTest(testData: typeof tests.$inferInsert) {
  try {
    const isConnected = await checkConnectivity();

    if (!isConnected) {
      // Save to local DB with pending status
      await db.insert(tests).values({
        ...testData,
        syncStatus: "pending",
      });
      return { success: true, offline: true };
    }

    // If online, try to upload
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) throw new Error("Upload failed");

    // Save to local DB with synced status
    await db.insert(tests).values({
      ...testData,
      syncStatus: "synced",
    });

    return { success: true, offline: false };
  } catch (error) {
    // Save to local DB with failed status
    await db.insert(tests).values({
      ...testData,
      syncStatus: "failed",
    });
    return { success: false, error };
  }
}

export async function syncPendingTests() {
  try {
    const pendingTests = await db
      .select()
      .from(tests)
      .where(eq(tests.syncStatus, "pending"));

    for (const test of pendingTests) {
      try {
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(test),
        });

        if (!response.ok) throw new Error("Upload failed");

        // Update sync status to synced
        await db
          .update(tests)
          .set({ syncStatus: "synced" })
          .where(eq(tests.id, test.id));
      } catch (error) {
        // Update sync status to failed
        await db
          .update(tests)
          .set({ syncStatus: "failed" })
          .where(eq(tests.id, test.id));
      }
    }
  } catch (error) {
    console.error("Sync error:", error);
  }
}
