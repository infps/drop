import { pgTable, text, boolean, integer, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { ReservationStatus, ReservationSource } from "../../enums";
import { outlets } from "../outlet/outlet.model";
import { tables } from "../floor/table.model";

export const reservations = pgTable("reservations", {
  id: uuid("id").primaryKey().defaultRandom(),
  outletId: uuid("outlet_id").notNull().references(() => outlets.id, { onDelete: "cascade" }),
  tableId: uuid("table_id").references(() => tables.id),
  customerId: text("customer_id"),

  // Guest details
  guestName: text("guest_name").notNull(),
  guestPhone: text("guest_phone").notNull(),
  guestEmail: text("guest_email"),
  guestCount: integer("guest_count").notNull(),

  // Timing
  date: timestamp("date", { mode: "date" }).notNull(),
  timeSlot: text("time_slot").notNull(),
  duration: integer("duration").default(90).notNull(),

  // Status
  status: text("status").default("PENDING").notNull().$type<ReservationStatus>(),

  // Additional
  specialRequests: text("special_requests"),
  occasion: text("occasion"),
  depositAmount: real("deposit_amount"),
  depositPaid: boolean("deposit_paid").default(false).notNull(),
  minimumSpend: real("minimum_spend"),

  // Confirmation
  confirmationCode: text("confirmation_code").unique().notNull(),
  confirmedAt: timestamp("confirmed_at", { mode: "date" }),
  cancelledAt: timestamp("cancelled_at", { mode: "date" }),
  cancelReason: text("cancel_reason"),

  // Source
  source: text("source").default("PHONE").notNull().$type<ReservationSource>(),
  externalRef: text("external_ref"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const reservationsRelations = relations(reservations, ({ one }) => ({
  outlet: one(outlets, {
    fields: [reservations.outletId],
    references: [outlets.id],
  }),
  table: one(tables, {
    fields: [reservations.tableId],
    references: [tables.id],
  }),
}));
