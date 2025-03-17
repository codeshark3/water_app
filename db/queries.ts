import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { tests } from "~/db/schema";
import { eq, or } from "drizzle-orm";

const expoDb = openDatabaseSync("water");
const db = drizzle(expoDb);

export const createTest = async (test: typeof tests.$inferInsert) => {
  await db.insert(tests).values(test);
  return test;
};
// db.insert(tests).values({
//     title: data.title,
//     description: data.description,
//     imageUri: image, // Save image path
//   });

export const getTests = async () => {
  const result = await db.select().from(tests);
  return result;
};

export const getTestById = async (id: number) => {
  const result = await db.select().from(tests).where(eq(tests.id, id));
  return result;
};

export const updateTest = async (
  id: number,
  test: Partial<typeof tests.$inferInsert>
) => {
  await db.update(tests).set(test).where(eq(tests.id, id));
  return test;
};

export const deleteTest = async (id: number) => {
  await db.delete(tests).where(eq(tests.id, id));
};

export const getPendingTests = async () => {
  const result = await db
    .select()
    .from(tests)
    .where(or(eq(tests.syncStatus, "pending"), eq(tests.syncStatus, "failed")));
  return result;
};

export const updateTestSyncStatus = async (
  id: number,
  status: "synced" | "failed" | "pending"
) => {
  await db.update(tests).set({ syncStatus: status }).where(eq(tests.id, id));
};

export const createTestWithSync = async (
  test: typeof tests.$inferInsert,
  isConnected: boolean
) => {
  const testWithStatus = {
    ...test,
    syncStatus: isConnected ? "synced" : "pending",
  };
  await createTest(testWithStatus);
  return { success: true, offline: !isConnected };
};

export const getLocalTestCount = async () => {
  const count = await db.$count(
    tests,
    or(eq(tests.syncStatus, "pending"), eq(tests.syncStatus, "failed"))
  );
  return count;
};

export const getUploadedTestCount = async () => {
  const count = await db.$count(tests, eq(tests.syncStatus, "synced"));
  return count;
};
