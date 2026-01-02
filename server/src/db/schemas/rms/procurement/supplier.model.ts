import { pgTable, text, boolean, integer, real, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { supplierItems } from "./supplier-item.model";
import { purchaseOrders } from "./purchase-order.model";

export const suppliers = pgTable("suppliers", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: text("vendor_id").notNull(),
  name: text("name").notNull(),
  code: text("code").notNull(),

  // Contact
  contactName: text("contact_name"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),

  // Terms
  paymentTerms: integer("payment_terms"),
  leadTime: integer("lead_time"),
  minimumOrder: real("minimum_order"),

  // Performance
  rating: real("rating").default(0).notNull(),

  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => ({
  unq: unique().on(table.vendorId, table.code),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  items: many(supplierItems),
  purchaseOrders: many(purchaseOrders),
}));
