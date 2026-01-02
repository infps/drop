import { pgTable, text, boolean, real, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { vendors } from "../../vendor/vendor.model";

export const outlets = pgTable("outlets", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id").notNull().references(() => vendors.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  code: text("code").unique().notNull(),
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  phone: text("phone"),
  email: text("email"),
  timezone: text("timezone").default("Asia/Kolkata").notNull(),
  currency: text("currency").default("INR").notNull(),

  // Operating hours
  openingTime: text("opening_time").notNull(),
  closingTime: text("closing_time").notNull(),
  isOpen: boolean("is_open").default(true).notNull(),

  // Tax settings
  taxRate: real("tax_rate").default(5).notNull(),
  serviceChargeRate: real("service_charge_rate").default(0).notNull(),

  // Settings
  settings: jsonb("settings"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const outletsRelations = relations(outlets, ({ one }) => ({
  vendor: one(vendors, {
    fields: [outlets.vendorId],
    references: [vendors.id],
  }),
}));
