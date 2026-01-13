import { pgTable, text, boolean, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { menuCategories } from "./menu-category.model";

export const menuSets = pgTable("menu_sets", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: text("vendor_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),

  // Availability
  isActive: boolean("is_active").default(true).notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  daysOfWeek: integer("days_of_week").array(),

  // Dates
  validFrom: timestamp("valid_from", { mode: "date" }),
  validTo: timestamp("valid_to", { mode: "date" }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const menuSetsRelations = relations(menuSets, ({ many }) => ({
  categories: many(menuCategories),
}));
