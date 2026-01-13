import { pgTable, text, real, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { recipes } from "./recipe.model";

export const recipeIngredients = pgTable("recipe_ingredients", {
  id: uuid("id").primaryKey().defaultRandom(),
  recipeId: uuid("recipe_id").notNull().references(() => recipes.id, { onDelete: "cascade" }),
  inventoryItemId: text("inventory_item_id").notNull(),

  quantity: real("quantity").notNull(),
  unit: text("unit").notNull(),
  wastagePercent: real("wastage_percent").default(0).notNull(),
});

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeIngredients.recipeId],
    references: [recipes.id],
  }),
}));
