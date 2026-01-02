import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { TicketType, TicketStatus } from "../enums";
import { users } from "../user/user.model";
import { orders } from "../order/order.model";
import { ticketMessages } from "./ticket-message.model";

export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  orderId: uuid("order_id").references(() => orders.id),
  type: text("type").notNull().$type<TicketType>(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").default("OPEN").notNull().$type<TicketStatus>(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [supportTickets.orderId],
    references: [orders.id],
  }),
  messages: many(ticketMessages),
}));
