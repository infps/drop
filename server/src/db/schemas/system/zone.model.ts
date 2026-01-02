import { pgTable, text, boolean, real, jsonb, uuid } from "drizzle-orm/pg-core";

export const zones = pgTable("zones", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  polygon: jsonb("polygon").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  surgePricing: real("surge_pricing").default(1).notNull(),
  deliveryFee: real("delivery_fee").default(0).notNull(),
});
