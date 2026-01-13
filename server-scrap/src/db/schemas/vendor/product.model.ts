import { pgTable, text, boolean, real, integer, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { vendors } from "./vendor.model";
import { categories } from "./category.model";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id").notNull().references(() => vendors.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => categories.id),
  name: text("name").notNull(),
  description: text("description"),
  images: text("images").array().default([]).notNull(),
  price: real("price").notNull(),
  discountPrice: real("discount_price"),

  // Inventory
  inStock: boolean("in_stock").default(true).notNull(),
  stockQuantity: integer("stock_quantity"),

  // Details
  isVeg: boolean("is_veg").default(true).notNull(),
  isVegan: boolean("is_vegan").default(false).notNull(),
  calories: integer("calories"),
  allergens: text("allergens").array().default([]).notNull(),

  // Grocery specific
  packSize: text("pack_size"),
  brand: text("brand"),
  dietType: text("diet_type"),

  // Wine specific
  abvPercent: real("abv_percent"),
  tasteProfile: text("taste_profile"),
  countryOfOrigin: text("country_of_origin"),
  year: integer("year"),
  grapeType: text("grape_type"),
  pairings: text("pairings").array().default([]).notNull(),

  // Customizations
  customizations: jsonb("customizations"),

  // Ratings
  rating: real("rating").default(0).notNull(),
  totalRatings: integer("total_ratings").default(0).notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ one }) => ({
  vendor: one(vendors, {
    fields: [products.vendorId],
    references: [vendors.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));
