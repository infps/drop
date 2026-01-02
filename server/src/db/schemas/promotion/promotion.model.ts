import { pgTable, text, boolean, real, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { DiscountType } from "../enums";
import { vendors } from "../vendor/vendor.model";

export const promotions = pgTable("promotions", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }),
  code: text("code").unique().notNull(),
  description: text("description").notNull(),
  discountType: text("discount_type").notNull().$type<DiscountType>(),
  discountValue: real("discount_value").notNull(),
  minOrderValue: real("min_order_value").default(0).notNull(),
  maxDiscount: real("max_discount"),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0).notNull(),
  startDate: timestamp("start_date", { mode: "date" }).notNull(),
  endDate: timestamp("end_date", { mode: "date" }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const promotionsRelations = relations(promotions, ({ one }) => ({
  vendor: one(vendors, {
    fields: [promotions.vendorId],
    references: [vendors.id],
  }),
}));
