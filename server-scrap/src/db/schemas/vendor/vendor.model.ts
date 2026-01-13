import { pgTable, text, boolean, real, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { VendorType } from "../enums";
import { categories } from "./category.model";
import { products } from "./product.model";

export const vendors = pgTable("vendors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  logo: text("logo"),
  coverImage: text("cover_image"),
  type: text("type").notNull().$type<VendorType>(),
  isVerified: boolean("is_verified").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  rating: real("rating").default(0).notNull(),
  totalRatings: integer("total_ratings").default(0).notNull(),

  // Authentication
  email: text("email").unique(),
  phone: text("phone").unique(),
  password: text("password"),

  // Location
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  deliveryRadius: real("delivery_radius").default(5).notNull(),

  // Business info
  openingTime: text("opening_time").notNull(),
  closingTime: text("closing_time").notNull(),
  minimumOrder: real("minimum_order").default(0).notNull(),
  avgDeliveryTime: integer("avg_delivery_time").default(30).notNull(),

  // Commission
  commissionRate: real("commission_rate").default(15).notNull(),

  // For alcohol vendors
  licenseNumber: text("license_number"),
  licenseExpiry: timestamp("license_expiry", { mode: "date" }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const vendorsRelations = relations(vendors, ({ many }) => ({
  categories: many(categories),
  products: many(products),
}));
