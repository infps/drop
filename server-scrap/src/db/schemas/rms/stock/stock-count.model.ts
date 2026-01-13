import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { StockCountType, StockCountStatus } from "../../enums";
import { outlets } from "../outlet/outlet.model";
import { stockCountItems } from "./stock-count-item.model";

export const stockCounts = pgTable("stock_counts", {
  id: uuid("id").primaryKey().defaultRandom(),
  outletId: uuid("outlet_id").notNull().references(() => outlets.id),
  countNumber: text("count_number").unique().notNull(),

  type: text("type").default("FULL").notNull().$type<StockCountType>(),
  status: text("status").default("IN_PROGRESS").notNull().$type<StockCountStatus>(),

  startedAt: timestamp("started_at", { mode: "date" }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { mode: "date" }),

  startedByEmployeeId: text("started_by_employee_id").notNull(),

  notes: text("notes"),
});

export const stockCountsRelations = relations(stockCounts, ({ one, many }) => ({
  outlet: one(outlets, {
    fields: [stockCounts.outletId],
    references: [outlets.id],
  }),
  items: many(stockCountItems),
}));
