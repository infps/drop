import { pgTable, text, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { OrderStatus, OrderType, PaymentStatus } from "../enums";
import { users } from "../user/user.model";
import { vendors } from "../vendor/vendor.model";
import { addresses } from "../user/address.model";
import { riders } from "../rider/rider.model";
import { orderItems } from "./order-item.model";
import { orderStatusHistory } from "./order-status-history.model";

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: text("order_number").unique().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id),
  vendorId: uuid("vendor_id").notNull().references(() => vendors.id),
  addressId: uuid("address_id").references(() => addresses.id),
  riderId: uuid("rider_id").references(() => riders.id),

  // Order details
  status: text("status").default("PENDING").notNull().$type<OrderStatus>(),
  type: text("type").default("DELIVERY").notNull().$type<OrderType>(),

  // Pricing
  subtotal: real("subtotal").notNull(),
  deliveryFee: real("delivery_fee").default(0).notNull(),
  platformFee: real("platform_fee").default(0).notNull(),
  discount: real("discount").default(0).notNull(),
  tip: real("tip").default(0).notNull(),
  total: real("total").notNull(),

  // Delivery
  scheduledFor: timestamp("scheduled_for", { mode: "date" }),
  estimatedDelivery: timestamp("estimated_delivery", { mode: "date" }),
  deliveredAt: timestamp("delivered_at", { mode: "date" }),
  deliveryInstructions: text("delivery_instructions"),

  // Payment
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").default("PENDING").notNull().$type<PaymentStatus>(),

  // Party orders
  partyEventId: text("party_event_id"),

  // Tracking
  currentLat: real("current_lat"),
  currentLng: real("current_lng"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  vendor: one(vendors, {
    fields: [orders.vendorId],
    references: [vendors.id],
  }),
  address: one(addresses, {
    fields: [orders.addressId],
    references: [addresses.id],
  }),
  rider: one(riders, {
    fields: [orders.riderId],
    references: [riders.id],
  }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
}));
