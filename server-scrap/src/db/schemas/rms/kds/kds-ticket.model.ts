import { pgTable, text, boolean, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { KDSTicketStatus } from "../../enums";
import { kdsStations } from "./kds-station.model";
import { kdsTicketItems } from "./kds-ticket-item.model";

export const kdsTickets = pgTable("kds_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  stationId: uuid("station_id").notNull().references(() => kdsStations.id),
  orderNumber: text("order_number").notNull(),
  tableNumber: text("table_number"),
  orderType: text("order_type").notNull(),

  // Timing
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  acknowledgedAt: timestamp("acknowledged_at", { mode: "date" }),
  startedAt: timestamp("started_at", { mode: "date" }),
  completedAt: timestamp("completed_at", { mode: "date" }),

  // Status
  status: text("status").default("NEW").notNull().$type<KDSTicketStatus>(),

  // Priority
  priority: integer("priority").default(0).notNull(),
  isRush: boolean("is_rush").default(false).notNull(),
});

export const kdsTicketsRelations = relations(kdsTickets, ({ one, many }) => ({
  station: one(kdsStations, {
    fields: [kdsTickets.stationId],
    references: [kdsStations.id],
  }),
  items: many(kdsTicketItems),
}));
