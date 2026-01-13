import { pgTable, text, real, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tipPools } from "./tip-pool.model";

export const tipAllocations = pgTable("tip_allocations", {
  id: uuid("id").primaryKey().defaultRandom(),
  tipPoolId: uuid("tip_pool_id")
    .notNull()
    .references(() => tipPools.id, { onDelete: "cascade" }),
  employeeId: text("employee_id").notNull(),

  sharePercent: real("share_percent"),
  amount: real("amount").notNull(),
});

export const tipAllocationsRelations = relations(tipAllocations, ({ one }) => ({
  tipPool: one(tipPools, {
    fields: [tipAllocations.tipPoolId],
    references: [tipPools.id],
  }),
}));
