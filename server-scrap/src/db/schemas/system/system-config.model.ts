import { pgTable, text, jsonb, timestamp, uuid } from "drizzle-orm/pg-core";

export const systemConfigs = pgTable("system_configs", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").unique().notNull(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
