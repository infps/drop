import { pgTable, text, boolean, integer, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { guestFeedbacks } from "./guest-feedback.model";

export const guestProfiles = pgTable("guest_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: text("vendor_id").notNull(),

  // Contact
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  email: text("email"),
  phone: text("phone"),

  // Preferences
  dietaryRestrictions: text("dietary_restrictions").array().default([]).notNull(),
  allergies: text("allergies").array().default([]).notNull(),
  preferences: text("preferences"),

  // Dates
  birthday: timestamp("birthday", { mode: "date" }),
  anniversary: timestamp("anniversary", { mode: "date" }),

  // Stats
  totalVisits: integer("total_visits").default(0).notNull(),
  totalSpend: real("total_spend").default(0).notNull(),
  averageSpend: real("average_spend").default(0).notNull(),
  lastVisit: timestamp("last_visit", { mode: "date" }),

  // Loyalty
  loyaltyTier: text("loyalty_tier"),
  loyaltyPoints: integer("loyalty_points").default(0).notNull(),

  // Tags
  tags: text("tags").array().default([]).notNull(),
  vipStatus: boolean("vip_status").default(false).notNull(),

  notes: text("notes"),

  marketingConsent: boolean("marketing_consent").default(false).notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const guestProfilesRelations = relations(guestProfiles, ({ many }) => ({
  feedbacks: many(guestFeedbacks),
}));
