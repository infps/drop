import { pgTable, text, integer, real, boolean, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { CourseType, OrderItemStatus } from "../../enums";
import { dineInOrders } from "./dine-in-order.model";

export const dineInOrderItems = pgTable("dine_in_order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => dineInOrders.id, { onDelete: "cascade" }),
  menuItemId: text("menu_item_id").notNull(),

  // Item details
  name: text("name").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  unitPrice: real("unit_price").notNull(),
  totalPrice: real("total_price").notNull(),

  // Seat assignment
  seatNumber: integer("seat_number"),

  // Course management
  courseNumber: integer("course_number").default(1).notNull(),
  courseType: text("course_type").default("MAIN").notNull().$type<CourseType>(),

  // Status
  status: text("status").default("PENDING").notNull().$type<OrderItemStatus>(),
  sentToKitchenAt: timestamp("sent_to_kitchen_at", { mode: "date" }),
  preparedAt: timestamp("prepared_at", { mode: "date" }),
  servedAt: timestamp("served_at", { mode: "date" }),

  // Modifiers
  modifiers: jsonb("modifiers"),
  specialInstructions: text("special_instructions"),

  // Void/Comp
  isVoid: boolean("is_void").default(false).notNull(),
  voidReason: text("void_reason"),
  voidByEmployeeId: text("void_by_employee_id"),
  isComp: boolean("is_comp").default(false).notNull(),
  compReason: text("comp_reason"),
  compByEmployeeId: text("comp_by_employee_id"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const dineInOrderItemsRelations = relations(dineInOrderItems, ({ one }) => ({
  order: one(dineInOrders, {
    fields: [dineInOrderItems.orderId],
    references: [dineInOrders.id],
  }),
}));
