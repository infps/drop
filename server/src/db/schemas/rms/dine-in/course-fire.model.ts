import { pgTable, integer, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { dineInOrders } from "./dine-in-order.model";

export const courseFires = pgTable("course_fires", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => dineInOrders.id, { onDelete: "cascade" }),
  courseNumber: integer("course_number").notNull(),
  firedAt: timestamp("fired_at", { mode: "date" }).defaultNow().notNull(),
  firedByEmployeeId: text("fired_by_employee_id").notNull(),
});

export const courseFiresRelations = relations(courseFires, ({ one }) => ({
  order: one(dineInOrders, {
    fields: [courseFires.orderId],
    references: [dineInOrders.id],
  }),
}));
