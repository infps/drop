import { pgTable, text, boolean, real, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./user.model";

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  fullAddress: text("full_address").notNull(),
  landmark: text("landmark"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));
