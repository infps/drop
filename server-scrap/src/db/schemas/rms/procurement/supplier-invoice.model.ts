import { pgTable, text, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { InvoiceStatus } from "../../enums";
import { purchaseOrders } from "./purchase-order.model";

export const supplierInvoices = pgTable("supplier_invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceNumber: text("invoice_number").notNull(),
  purchaseOrderId: uuid("purchase_order_id").notNull().references(() => purchaseOrders.id),

  invoiceDate: timestamp("invoice_date", { mode: "date" }).notNull(),
  dueDate: timestamp("due_date", { mode: "date" }),

  subtotal: real("subtotal").notNull(),
  taxAmount: real("tax_amount").notNull(),
  total: real("total").notNull(),

  status: text("status").default("PENDING").notNull().$type<InvoiceStatus>(),
  paidAt: timestamp("paid_at", { mode: "date" }),
});

export const supplierInvoicesRelations = relations(supplierInvoices, ({ one }) => ({
  purchaseOrder: one(purchaseOrders, {
    fields: [supplierInvoices.purchaseOrderId],
    references: [purchaseOrders.id],
  }),
}));
