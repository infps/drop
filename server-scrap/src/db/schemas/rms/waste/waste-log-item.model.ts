import { pgTable, text, real, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { WasteReason } from "../../enums";
import { wasteLogs } from "./waste-log.model";

export const wasteLogItems = pgTable("waste_log_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  wasteLogId: uuid("waste_log_id").notNull().references(() => wasteLogs.id, { onDelete: "cascade" }),
  inventoryItemId: text("inventory_item_id"),
  menuItemId: text("menu_item_id"),

  itemName: text("item_name").notNull(),
  quantity: real("quantity").notNull(),
  unit: text("unit").notNull(),
  reason: text("reason").notNull().$type<WasteReason>(),
  value: real("value").notNull(),

  notes: text("notes"),
});

export const wasteLogItemsRelations = relations(wasteLogItems, ({ one }) => ({
  wasteLog: one(wasteLogs, {
    fields: [wasteLogItems.wasteLogId],
    references: [wasteLogs.id],
  }),
}));
