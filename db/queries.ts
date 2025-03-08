import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { tests } from "@/db/schema";
import { eq } from "drizzle-orm";

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
  test: typeof tests.$inferInsert
) => {
  await db.update(tests).set(test).where(eq(tests.id, id));
  return test;
};

export const deleteTest = async (id: number) => {
  await db.delete(tests).where(eq(tests.id, id));
};
