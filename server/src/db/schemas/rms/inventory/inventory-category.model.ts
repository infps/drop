import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { inventoryItems } from "./inventory-item.model";

export const inventoryCategories = pgTable("inventory_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: text("vendor_id").notNull(),
  name: text("name").notNull(),
  parentId: uuid("parent_id"),
});

export const inventoryCategoriesRelations = relations(inventoryCategories, ({ one, many }) => ({
  parent: one(inventoryCategories, {
    fields: [inventoryCategories.parentId],
    references: [inventoryCategories.id],
    relationName: "subcategories",
  }),
  children: many(inventoryCategories, { relationName: "subcategories" }),
  items: many(inventoryItems),
}));
