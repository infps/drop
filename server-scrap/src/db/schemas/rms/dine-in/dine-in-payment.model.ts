import { pgTable, text, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { DineInPaymentMethod, PaymentStatus } from "../../enums";
import { dineInOrders } from "./dine-in-order.model";
import { splitBills } from "./split-bill.model";

export const dineInPayments = pgTable("dine_in_payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => dineInOrders.id),
  splitBillId: uuid("split_bill_id").references(() => splitBills.id),

  // Payment details
  method: text("method").notNull().$type<DineInPaymentMethod>(),
  amount: real("amount").notNull(),
  tipAmount: real("tip_amount").default(0).notNull(),

  // Card details
  cardLastFour: text("card_last_four"),
  cardType: text("card_type"),

  // Reference
  transactionId: text("transaction_id"),
  authCode: text("auth_code"),

  // Status
  status: text("status").default("COMPLETED").notNull().$type<PaymentStatus>(),

  // Employee
  processedByEmployeeId: text("processed_by_employee_id").notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const dineInPaymentsRelations = relations(dineInPayments, ({ one }) => ({
  order: one(dineInOrders, {
    fields: [dineInPayments.orderId],
    references: [dineInOrders.id],
  }),
  splitBill: one(splitBills, {
    fields: [dineInPayments.splitBillId],
    references: [splitBills.id],
  }),
}));
