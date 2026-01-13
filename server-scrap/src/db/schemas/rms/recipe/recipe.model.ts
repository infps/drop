import { pgTable, text, real, integer, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { recipeIngredients } from "./recipe-ingredient.model";
import { recipeSubRecipes } from "./recipe-sub-recipe.model";

export const recipes = pgTable("recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: text("vendor_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),

  // Yield
  yieldQuantity: real("yield_quantity").default(1).notNull(),
  yieldUnit: text("yield_unit").default("portion").notNull(),

  // Prep info
  prepTime: integer("prep_time"),
  cookTime: integer("cook_time"),

  // Instructions
  instructions: jsonb("instructions"),

  // Nutrition
  calories: integer("calories"),
  protein: real("protein"),
  carbs: real("carbs"),
  fat: real("fat"),

  // Cost
  totalCost: real("total_cost"),
  costPerServing: real("cost_per_serving"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const recipesRelations = relations(recipes, ({ many }) => ({
  ingredients: many(recipeIngredients),
  subRecipes: many(recipeSubRecipes, { relationName: "parent" }),
  usedInRecipes: many(recipeSubRecipes, { relationName: "sub" }),
}));
