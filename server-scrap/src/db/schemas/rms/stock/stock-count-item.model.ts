import { pgTable, text, real, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { stockCounts } from "./stock-count.model";

export const stockCountItems = pgTable("stock_count_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  stockCountId: uuid("stock_count_id").notNull().references(() => stockCounts.id, { onDelete: "cascade" }),
  inventoryItemId: text("inventory_item_id").notNull(),

  systemQty: real("system_qty").notNull(),
  countedQty: real("counted_qty"),
  variance: real("variance"),

  notes: text("notes"),
});

export const stockCountItemsRelations = relations(stockCountItems, ({ one }) => ({
  stockCount: one(stockCounts, {
    fields: [stockCountItems.stockCountId],
    references: [stockCounts.id],
  }),
}));
