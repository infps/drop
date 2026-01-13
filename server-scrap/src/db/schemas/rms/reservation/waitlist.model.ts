import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { WaitlistStatus } from "../../enums";

export const waitlists = pgTable("waitlists", {
  id: uuid("id").primaryKey().defaultRandom(),
  outletId: text("outlet_id").notNull(),
  guestName: text("guest_name").notNull(),
  guestPhone: text("guest_phone").notNull(),
  guestCount: integer("guest_count").notNull(),
  estimatedWait: integer("estimated_wait").notNull(),
  quotedWait: integer("quoted_wait"),
  status: text("status").default("WAITING").notNull().$type<WaitlistStatus>(),
  notes: text("notes"),
  notifiedAt: timestamp("notified_at", { mode: "date" }),
  seatedAt: timestamp("seated_at", { mode: "date" }),
  leftAt: timestamp("left_at", { mode: "date" }),
  tableId: text("table_id"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
