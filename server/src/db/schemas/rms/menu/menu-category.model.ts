import { pgTable, text, boolean, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { menuSets } from "./menu-set.model";
import { menuItems } from "./menu-item.model";

export const menuCategories = pgTable("menu_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  menuSetId: uuid("menu_set_id").notNull().references(() => menuSets.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id"),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const menuCategoriesRelations = relations(menuCategories, ({ one, many }) => ({
  menuSet: one(menuSets, {
    fields: [menuCategories.menuSetId],
    references: [menuSets.id],
  }),
  parent: one(menuCategories, {
    fields: [menuCategories.parentId],
    references: [menuCategories.id],
    relationName: "subcategories",
  }),
  children: many(menuCategories, { relationName: "subcategories" }),
  items: many(menuItems),
}));
