import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { KDSItemStatus } from "../../enums";
import { kdsTickets } from "./kds-ticket.model";

export const kdsTicketItems = pgTable("kds_ticket_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketId: uuid("ticket_id").notNull().references(() => kdsTickets.id, { onDelete: "cascade" }),
  orderItemId: text("order_item_id"),

  name: text("name").notNull(),
  quantity: integer("quantity").notNull(),
  modifiers: text("modifiers"),
  specialInstructions: text("special_instructions"),

  status: text("status").default("PENDING").notNull().$type<KDSItemStatus>(),
  completedAt: timestamp("completed_at", { mode: "date" }),
});

export const kdsTicketItemsRelations = relations(kdsTicketItems, ({ one }) => ({
  ticket: one(kdsTickets, {
    fields: [kdsTicketItems.ticketId],
    references: [kdsTickets.id],
  }),
}));
