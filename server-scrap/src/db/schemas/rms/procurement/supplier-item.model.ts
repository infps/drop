import { pgTable, text, boolean, real, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { suppliers } from "./supplier.model";

export const supplierItems = pgTable("supplier_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  supplierId: uuid("supplier_id").notNull().references(() => suppliers.id, { onDelete: "cascade" }),
  inventoryItemId: text("inventory_item_id").notNull(),

  supplierSku: text("supplier_sku"),
  unitPrice: real("unit_price").notNull(),
  minOrderQty: real("min_order_qty").default(1).notNull(),
  leadTime: integer("lead_time"),

  isPreferred: boolean("is_preferred").default(false).notNull(),
});

export const supplierItemsRelations = relations(supplierItems, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [supplierItems.supplierId],
    references: [suppliers.id],
  }),
}));
