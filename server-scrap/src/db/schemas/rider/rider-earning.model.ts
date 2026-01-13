import { pgTable, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { riders } from "./rider.model";

export const riderEarnings = pgTable("rider_earnings", {
  id: uuid("id").primaryKey().defaultRandom(),
  riderId: uuid("rider_id").notNull().references(() => riders.id, { onDelete: "cascade" }),
  date: timestamp("date", { mode: "date" }).defaultNow().notNull(),
  baseEarning: real("base_earning").notNull(),
  tip: real("tip").default(0).notNull(),
  incentive: real("incentive").default(0).notNull(),
  penalty: real("penalty").default(0).notNull(),
  total: real("total").notNull(),
});

export const riderEarningsRelations = relations(riderEarnings, ({ one }) => ({
  rider: one(riders, {
    fields: [riderEarnings.riderId],
    references: [riders.id],
  }),
}));
