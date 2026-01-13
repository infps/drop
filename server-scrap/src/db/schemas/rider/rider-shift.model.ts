import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { riders } from "./rider.model";

export const riderShifts = pgTable("rider_shifts", {
  id: uuid("id").primaryKey().defaultRandom(),
  riderId: uuid("rider_id").notNull().references(() => riders.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time", { mode: "date" }).notNull(),
  endTime: timestamp("end_time", { mode: "date" }),
  zone: text("zone"),
});

export const riderShiftsRelations = relations(riderShifts, ({ one }) => ({
  rider: one(riders, {
    fields: [riderShifts.riderId],
    references: [riders.id],
  }),
}));
