import { pgTable, real, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { stockTransfers } from "./stock-transfer.model";

export const stockTransferItems = pgTable("stock_transfer_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  transferId: uuid("transfer_id")
    .notNull()
    .references(() => stockTransfers.id, { onDelete: "cascade" }),
  inventoryItemId: text("inventory_item_id").notNull(),

  requestedQty: real("requested_qty").notNull(),
  shippedQty: real("shipped_qty"),
  receivedQty: real("received_qty"),
});

export const stockTransferItemsRelations = relations(
  stockTransferItems,
  ({ one }) => ({
    transfer: one(stockTransfers, {
      fields: [stockTransferItems.transferId],
      references: [stockTransfers.id],
    }),
  }),
);
