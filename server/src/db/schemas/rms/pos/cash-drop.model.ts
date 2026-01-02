import { pgTable, text, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { shifts } from "./shift.model";

export const cashDrops = pgTable("cash_drops", {
  id: uuid("id").primaryKey().defaultRandom(),
  shiftId: uuid("shift_id").notNull().references(() => shifts.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  reason: text("reason"),
  droppedAt: timestamp("dropped_at", { mode: "date" }).defaultNow().notNull(),
});

export const cashDropsRelations = relations(cashDrops, ({ one }) => ({
  shift: one(shifts, {
    fields: [cashDrops.shiftId],
    references: [shifts.id],
  }),
}));
