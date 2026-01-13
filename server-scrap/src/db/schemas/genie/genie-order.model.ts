import { pgTable, text, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { GenieOrderType, OrderStatus, PaymentStatus } from "../enums";
import { riders } from "../rider/rider.model";
import { genieStops } from "./genie-stop.model";

export const genieOrders = pgTable("genie_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: text("order_number").unique().notNull(),
  userId: text("user_id").notNull(),
  riderId: uuid("rider_id").references(() => riders.id),

  type: text("type").notNull().$type<GenieOrderType>(),
  status: text("status").default("PENDING").notNull().$type<OrderStatus>(),

  // Pricing
  estimatedPrice: real("estimated_price").notNull(),
  finalPrice: real("final_price"),
  distance: real("distance").notNull(),
  weight: real("weight"),

  // Payment
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").default("PENDING").notNull().$type<PaymentStatus>(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const genieOrdersRelations = relations(genieOrders, ({ one, many }) => ({
  rider: one(riders, {
    fields: [genieOrders.riderId],
    references: [riders.id],
  }),
  stops: many(genieStops),
}));
