import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { purchaseOrders } from "./purchase-order.model";
import { goodsReceiptItems } from "./goods-receipt-item.model";

export const goodsReceipts = pgTable("goods_receipts", {
  id: uuid("id").primaryKey().defaultRandom(),
  grnNumber: text("grn_number").unique().notNull(),
  purchaseOrderId: uuid("purchase_order_id").notNull().references(() => purchaseOrders.id),

  receivedDate: timestamp("received_date", { mode: "date" }).defaultNow().notNull(),
  receivedByEmployeeId: text("received_by_employee_id").notNull(),

  notes: text("notes"),
});

export const goodsReceiptsRelations = relations(goodsReceipts, ({ one, many }) => ({
  purchaseOrder: one(purchaseOrders, {
    fields: [goodsReceipts.purchaseOrderId],
    references: [purchaseOrders.id],
  }),
  items: many(goodsReceiptItems),
}));
