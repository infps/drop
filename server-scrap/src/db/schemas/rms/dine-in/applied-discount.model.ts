import { pgTable, text, boolean, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { DiscountType } from "../../enums";
import { dineInOrders } from "./dine-in-order.model";

export const appliedDiscounts = pgTable("applied_discounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => dineInOrders.id, { onDelete: "cascade" }),
  discountId: text("discount_id"),

  name: text("name").notNull(),
  type: text("type").notNull().$type<DiscountType>(),
  value: real("value").notNull(),
  amount: real("amount").notNull(),

  // Manager approval
  requiresApproval: boolean("requires_approval").default(false).notNull(),
  approvedByEmployeeId: text("approved_by_employee_id"),
  approvalPin: text("approval_pin"),
  reason: text("reason"),

  appliedByEmployeeId: text("applied_by_employee_id").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const appliedDiscountsRelations = relations(appliedDiscounts, ({ one }) => ({
  order: one(dineInOrders, {
    fields: [appliedDiscounts.orderId],
    references: [dineInOrders.id],
  }),
}));
