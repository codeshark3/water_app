import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const tests = sqliteTable("tests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  participantId: text("participantId").notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  location: text("location").notNull(),
  createdAt: text("createdAt").notNull(),
  createdBy: text("createdBy").notNull(),
  onchoImage: text("onchoImage"),
  schistoImage: text("schistoImage"),
  lfImage: text("lfImage"),
  helminthImage: text("helminthImage"),
});

// export const tests = sqliteTable("tests", {
//   id: integer("id").primaryKey({ autoIncrement: true }),
//   title: text("title").notNull(),
//   description: text("description"),
//   imageUri: text("imageUri"),
// });
