import { pgTable, text, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { TipPoolStatus } from "../../enums";
import { tipAllocations } from "./tip-allocation.model";

export const tipPools = pgTable("tip_pools", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: text("vendor_id").notNull(),
  outletId: text("outlet_id").notNull(),

  date: timestamp("date", { mode: "date" }).notNull(),
  shiftType: text("shift_type"),

  totalTips: real("total_tips").notNull(),

  status: text("status").default("PENDING").notNull().$type<TipPoolStatus>(),
  distributedAt: timestamp("distributed_at", { mode: "date" }),
});

export const tipPoolsRelations = relations(tipPools, ({ many }) => ({
  allocations: many(tipAllocations),
}));
