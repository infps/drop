import { pgTable, real, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { recipes } from "./recipe.model";

export const recipeSubRecipes = pgTable("recipe_sub_recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentRecipeId: uuid("parent_recipe_id").notNull().references(() => recipes.id, { onDelete: "cascade" }),
  subRecipeId: uuid("sub_recipe_id").notNull().references(() => recipes.id),
  quantity: real("quantity").notNull(),
});

export const recipeSubRecipesRelations = relations(recipeSubRecipes, ({ one }) => ({
  parentRecipe: one(recipes, {
    fields: [recipeSubRecipes.parentRecipeId],
    references: [recipes.id],
    relationName: "parent",
  }),
  subRecipe: one(recipes, {
    fields: [recipeSubRecipes.subRecipeId],
    references: [recipes.id],
    relationName: "sub",
  }),
}));
