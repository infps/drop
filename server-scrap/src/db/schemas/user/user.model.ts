import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { addresses } from "./address.model";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  phone: text("phone").unique(),
  email: text("email").unique(),
  name: text("name"),
  avatar: text("avatar"),
  dateOfBirth: timestamp("date_of_birth", { mode: "date" }),
  isKycVerified: boolean("is_kyc_verified").default(false).notNull(),
  isAgeVerified: boolean("is_age_verified").default(false).notNull(),
  preferredLanguage: text("preferred_language").default("en").notNull(),

  // Preferences
  cuisinePreferences: text("cuisine_preferences").array().default([]).notNull(),
  groceryBrands: text("grocery_brands").array().default([]).notNull(),
  alcoholPreferences: text("alcohol_preferences").array().default([]).notNull(),

  // Timestamps
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  addresses: many(addresses),
}));
