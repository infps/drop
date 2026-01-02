import { pgTable, text, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { StockMovementType } from "../../enums";
import { inventoryItems } from "./inventory-item.model";

export const stockMovements = pgTable("stock_movements", {
  id: uuid("id").primaryKey().defaultRandom(),
  inventoryItemId: uuid("inventory_item_id").notNull().references(() => inventoryItems.id),

  type: text("type").notNull().$type<StockMovementType>(),
  quantity: real("quantity").notNull(),

  // Reference
  referenceType: text("reference_type"),
  referenceId: text("reference_id"),

  // Costing
  unitCost: real("unit_cost"),
  totalCost: real("total_cost"),

  // User
  performedByEmployeeId: text("performed_by_employee_id"),
  notes: text("notes"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  inventoryItem: one(inventoryItems, {
    fields: [stockMovements.inventoryItemId],
    references: [inventoryItems.id],
  }),
}));
