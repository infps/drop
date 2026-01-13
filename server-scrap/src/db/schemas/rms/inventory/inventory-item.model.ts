import { pgTable, text, boolean, real, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { outlets } from "../outlet/outlet.model";
import { inventoryCategories } from "./inventory-category.model";
import { stockBatches} from "./stock-batch.model";
import { stockMovements } from "./stock-movement.model";

export const inventoryItems = pgTable("inventory_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: text("vendor_id").notNull(),
  outletId: uuid("outlet_id").references(() => outlets.id),

  // Identification
  sku: text("sku").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  barcode: text("barcode"),

  // Categorization
  categoryId: uuid("category_id").references(() => inventoryCategories.id),

  // Units
  unitOfMeasure: text("unit_of_measure").notNull(),
  conversionFactor: real("conversion_factor").default(1).notNull(),

  // Stock levels
  currentStock: real("current_stock").default(0).notNull(),
  parLevel: real("par_level"),
  reorderPoint: real("reorder_point"),
  reorderQuantity: real("reorder_quantity"),
  safetyStock: real("safety_stock"),

  // Costing
  averageCost: real("average_cost").default(0).notNull(),
  lastCost: real("last_cost"),

  // Storage
  storageLocation: text("storage_location"),
  storageTemp: text("storage_temp"),

  // Tracking
  trackBatch: boolean("track_batch").default(false).notNull(),
  trackExpiry: boolean("track_expiry").default(false).notNull(),

  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => ({
  unq: unique().on(table.vendorId, table.sku),
}));

export const inventoryItemsRelations = relations(inventoryItems, ({ one, many }) => ({
  outlet: one(outlets, {
    fields: [inventoryItems.outletId],
    references: [outlets.id],
  }),
  category: one(inventoryCategories, {
    fields: [inventoryItems.categoryId],
    references: [inventoryCategories.id],
  }),
  batches: many(stockBatches),
  movements: many(stockMovements),
}));
