import { pgTable, text, real, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { purchaseOrders } from "./purchase-order.model";
import { goodsReceiptItems } from "./goods-receipt-item.model";

export const purchaseOrderItems = pgTable("purchase_order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  purchaseOrderId: uuid("purchase_order_id")
    .notNull()
    .references(() => purchaseOrders.id, { onDelete: "cascade" }),
  inventoryItemId: text("inventory_item_id").notNull(),

  quantity: real("quantity").notNull(),
  unitPrice: real("unit_price").notNull(),
  taxRate: real("tax_rate").default(0).notNull(),
  total: real("total").notNull(),

  receivedQty: real("received_qty").default(0).notNull(),
});

export const purchaseOrderItemsRelations = relations(
  purchaseOrderItems,
  ({ one, many }) => ({
    purchaseOrder: one(purchaseOrders, {
      fields: [purchaseOrderItems.purchaseOrderId],
      references: [purchaseOrders.id],
    }),
    receiptItems: many(goodsReceiptItems),
  }),
);
