import { pgTable, text, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { goodsReceipts } from "./goods-receipt.model";
import { purchaseOrderItems } from "./purchase-order-item.model";

export const goodsReceiptItems = pgTable("goods_receipt_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  goodsReceiptId: uuid("goods_receipt_id").notNull().references(() => goodsReceipts.id, { onDelete: "cascade" }),
  purchaseOrderItemId: uuid("purchase_order_item_id").notNull().references(() => purchaseOrderItems.id),

  quantityReceived: real("quantity_received").notNull(),
  batchNumber: text("batch_number"),
  expiryDate: timestamp("expiry_date", { mode: "date" }),
});

export const goodsReceiptItemsRelations = relations(goodsReceiptItems, ({ one }) => ({
  goodsReceipt: one(goodsReceipts, {
    fields: [goodsReceiptItems.goodsReceiptId],
    references: [goodsReceipts.id],
  }),
  purchaseOrderItem: one(purchaseOrderItems, {
    fields: [goodsReceiptItems.purchaseOrderItemId],
    references: [purchaseOrderItems.id],
  }),
}));
