import { pgTable, text, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { inventoryItems } from "./inventory-item.model";

export const stockBatches = pgTable("stock_batches", {
  id: uuid("id").primaryKey().defaultRandom(),
  inventoryItemId: uuid("inventory_item_id").notNull().references(() => inventoryItems.id, { onDelete: "cascade" }),
  batchNumber: text("batch_number").notNull(),
  quantity: real("quantity").notNull(),

  // Dates
  receivedDate: timestamp("received_date", { mode: "date" }).defaultNow().notNull(),
  expiryDate: timestamp("expiry_date", { mode: "date" }),

  // Costing
  unitCost: real("unit_cost").notNull(),
});

export const stockBatchesRelations = relations(stockBatches, ({ one }) => ({
  inventoryItem: one(inventoryItems, {
    fields: [stockBatches.inventoryItemId],
    references: [inventoryItems.id],
  }),
}));
