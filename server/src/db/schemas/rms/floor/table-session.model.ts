import { pgTable, integer, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tables } from "./table.model";

export const tableSessions = pgTable("table_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tableId: uuid("table_id")
    .notNull()
    .references(() => tables.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time", { mode: "date" }).defaultNow().notNull(),
  endTime: timestamp("end_time", { mode: "date" }),
  guestCount: integer("guest_count").notNull(),
  serverEmployeeId: text("server_employee_id"),
});

export const tableSessionsRelations = relations(tableSessions, ({ one }) => ({
  table: one(tables, {
    fields: [tableSessions.tableId],
    references: [tables.id],
  }),
}));
