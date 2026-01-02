import { pgTable, text, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { POStatus } from "../../enums";
import { outlets } from "../outlet/outlet.model";
import { suppliers } from "./supplier.model";
import { purchaseOrderItems } from "./purchase-order-item.model";
import { goodsReceipts } from "./goods-receipt.model";
import { supplierInvoices } from "./supplier-invoice.model";

export const purchaseOrders = pgTable("purchase_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  poNumber: text("po_number").unique().notNull(),
  vendorId: text("vendor_id").notNull(),
  outletId: uuid("outlet_id").notNull().references(() => outlets.id),
  supplierId: uuid("supplier_id").notNull().references(() => suppliers.id),

  // Status
  status: text("status").default("DRAFT").notNull().$type<POStatus>(),

  // Dates
  orderDate: timestamp("order_date", { mode: "date" }).defaultNow().notNull(),
  expectedDate: timestamp("expected_date", { mode: "date" }),
  receivedDate: timestamp("received_date", { mode: "date" }),

  // Totals
  subtotal: real("subtotal").default(0).notNull(),
  taxAmount: real("tax_amount").default(0).notNull(),
  total: real("total").default(0).notNull(),

  // Approval
  approvedByEmployeeId: text("approved_by_employee_id"),
  approvedAt: timestamp("approved_at", { mode: "date" }),

  notes: text("notes"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const purchaseOrdersRelations = relations(purchaseOrders, ({ one, many }) => ({
  outlet: one(outlets, {
    fields: [purchaseOrders.outletId],
    references: [outlets.id],
  }),
  supplier: one(suppliers, {
    fields: [purchaseOrders.supplierId],
    references: [suppliers.id],
  }),
  items: many(purchaseOrderItems),
  receipts: many(goodsReceipts),
  invoices: many(supplierInvoices),
}));
