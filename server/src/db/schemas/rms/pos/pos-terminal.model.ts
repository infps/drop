import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { outlets } from "../outlet/outlet.model";
import { shifts } from "./shift.model";

export const posTerminals = pgTable("pos_terminals", {
  id: uuid("id").primaryKey().defaultRandom(),
  outletId: uuid("outlet_id").notNull().references(() => outlets.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  deviceId: text("device_id").unique().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastActiveAt: timestamp("last_active_at", { mode: "date" }),
});

export const posTerminalsRelations = relations(posTerminals, ({ one, many }) => ({
  outlet: one(outlets, {
    fields: [posTerminals.outletId],
    references: [outlets.id],
  }),
  shifts: many(shifts),
}));
