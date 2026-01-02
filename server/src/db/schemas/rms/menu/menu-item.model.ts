import { pgTable, text, boolean, real, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { menuCategories } from "./menu-category.model";
import { menuItemModifierGroups } from "./menu-item-modifier-group.model";

export const menuItems = pgTable("menu_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id").notNull().references(() => menuCategories.id, { onDelete: "cascade" }),
  sku: text("sku"),
  name: text("name").notNull(),
  description: text("description"),
  shortName: text("short_name"),
  image: text("image"),

  // Pricing
  price: real("price").notNull(),
  cost: real("cost"),

  // Recipe
  recipeId: text("recipe_id"),

  // Details
  isVeg: boolean("is_veg").default(true).notNull(),
  isVegan: boolean("is_vegan").default(false).notNull(),
  isGlutenFree: boolean("is_gluten_free").default(false).notNull(),
  spiceLevel: integer("spice_level"),
  calories: integer("calories"),
  prepTime: integer("prep_time"),

  // Allergens
  allergens: text("allergens").array().default([]).notNull(),

  // Tags
  tags: text("tags").array().default([]).notNull(),

  // Availability
  isActive: boolean("is_active").default(true).notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),

  // Display
  sortOrder: integer("sort_order").default(0).notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  category: one(menuCategories, {
    fields: [menuItems.categoryId],
    references: [menuCategories.id],
  }),
  modifierGroups: many(menuItemModifierGroups),
}));
