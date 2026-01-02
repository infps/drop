import { pgTable, text, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { vendors } from "./vendor.model";
import { products } from "./product.model";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  icon: text("icon"),
  image: text("image"),
  vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id"),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  vendor: one(vendors, {
    fields: [categories.vendorId],
    references: [vendors.id],
  }),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "subcategories",
  }),
  children: many(categories, { relationName: "subcategories" }),
  products: many(products),
}));
