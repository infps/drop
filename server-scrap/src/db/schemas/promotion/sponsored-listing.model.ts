import { pgTable, boolean, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { vendors } from "../vendor/vendor.model";

export const sponsoredListings = pgTable("sponsored_listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id").notNull().references(() => vendors.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date", { mode: "date" }).notNull(),
  endDate: timestamp("end_date", { mode: "date" }).notNull(),
  budget: real("budget").notNull(),
  spent: real("spent").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const sponsoredListingsRelations = relations(sponsoredListings, ({ one }) => ({
  vendor: one(vendors, {
    fields: [sponsoredListings.vendorId],
    references: [vendors.id],
  }),
}));
