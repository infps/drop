import { pgTable, text, integer, real, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { DineInOrderType, DineInOrderStatus, PaymentStatus } from "../../enums";
import { outlets } from "../outlet/outlet.model";
import { tables } from "../floor/table.model";
import { tableSessions } from "../floor/table-session.model";
import { dineInOrderItems } from "./dine-in-order-item.model";
import { dineInPayments } from "./dine-in-payment.model";
import { splitBills } from "./split-bill.model";

export const dineInOrders = pgTable("dine_in_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: text("order_number").unique().notNull(),
  outletId: uuid("outlet_id").notNull().references(() => outlets.id),
  tableId: uuid("table_id").notNull().references(() => tables.id),
  tableSessionId: uuid("table_session_id").references(() => tableSessions.id),

  // Server/Staff
  serverEmployeeId: text("server_employee_id"),
  createdByEmployeeId: text("created_by_employee_id").notNull(),

  // Guest info
  guestCount: integer("guest_count").default(1).notNull(),
  guestProfileId: text("guest_profile_id"),

  // Order type
  orderType: text("order_type").default("DINE_IN").notNull().$type<DineInOrderType>(),

  // Status
  status: text("status").default("OPEN").notNull().$type<DineInOrderStatus>(),

  // Pricing
  subtotal: real("subtotal").default(0).notNull(),
  taxAmount: real("tax_amount").default(0).notNull(),
  serviceCharge: real("service_charge").default(0).notNull(),
  discount: real("discount").default(0).notNull(),
  tip: real("tip").default(0).notNull(),
  total: real("total").default(0).notNull(),

  // Payment
  paymentStatus: text("payment_status").default("PENDING").notNull().$type<PaymentStatus>(),

  // Timing
  openedAt: timestamp("opened_at", { mode: "date" }).defaultNow().notNull(),
  closedAt: timestamp("closed_at", { mode: "date" }),
  printedAt: timestamp("printed_at", { mode: "date" }),

  // Notes
  notes: text("notes"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const dineInOrdersRelations = relations(dineInOrders, ({ one, many }) => ({
  outlet: one(outlets, {
    fields: [dineInOrders.outletId],
    references: [outlets.id],
  }),
  table: one(tables, {
    fields: [dineInOrders.tableId],
    references: [tables.id],
  }),
  tableSession: one(tableSessions, {
    fields: [dineInOrders.tableSessionId],
    references: [tableSessions.id],
  }),
  items: many(dineInOrderItems),
  payments: many(dineInPayments),
  splitBills: many(splitBills),
}));
