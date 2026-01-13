import { pgTable, text, integer, real, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { SplitBillType } from "../../enums";
import { dineInOrders } from "./dine-in-order.model";
import { splitBillItems } from "./split-bill-item.model";
import { dineInPayments } from "./dine-in-payment.model";

export const splitBills = pgTable("split_bills", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => dineInOrders.id, { onDelete: "cascade" }),
  splitNumber: integer("split_number").notNull(),
  splitType: text("split_type").default("EQUAL").notNull().$type<SplitBillType>(),

  // Amounts
  subtotal: real("subtotal").default(0).notNull(),
  taxAmount: real("tax_amount").default(0).notNull(),
  serviceCharge: real("service_charge").default(0).notNull(),
  tip: real("tip").default(0).notNull(),
  total: real("total").default(0).notNull(),

  // Payment
  isPaid: boolean("is_paid").default(false).notNull(),
  paidAt: timestamp("paid_at", { mode: "date" }),
});

export const splitBillsRelations = relations(splitBills, ({ one, many }) => ({
  order: one(dineInOrders, {
    fields: [splitBills.orderId],
    references: [dineInOrders.id],
  }),
  items: many(splitBillItems),
  payments: many(dineInPayments),
}));
