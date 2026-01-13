import { pgTable, text, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { ShiftStatus } from "../../enums";
import { outlets } from "../outlet/outlet.model";
import { posTerminals } from "./pos-terminal.model";
import { cashDrops } from "./cash-drop.model";

export const shifts = pgTable("shifts", {
  id: uuid("id").primaryKey().defaultRandom(),
  outletId: uuid("outlet_id").notNull().references(() => outlets.id),
  terminalId: uuid("terminal_id").references(() => posTerminals.id),
  employeeId: text("employee_id").notNull(),

  // Timing
  startTime: timestamp("start_time", { mode: "date" }).defaultNow().notNull(),
  endTime: timestamp("end_time", { mode: "date" }),

  // Cash management
  openingFloat: real("opening_float").default(0).notNull(),
  closingFloat: real("closing_float"),
  expectedCash: real("expected_cash"),
  actualCash: real("actual_cash"),
  variance: real("variance"),

  // Totals
  totalSales: real("total_sales").default(0).notNull(),
  totalTax: real("total_tax").default(0).notNull(),
  totalDiscount: real("total_discount").default(0).notNull(),
  totalTips: real("total_tips").default(0).notNull(),

  // Payment breakdown
  cashSales: real("cash_sales").default(0).notNull(),
  cardSales: real("card_sales").default(0).notNull(),
  otherSales: real("other_sales").default(0).notNull(),

  // Status
  status: text("status").default("OPEN").notNull().$type<ShiftStatus>(),
  notes: text("notes"),
});

export const shiftsRelations = relations(shifts, ({ one, many }) => ({
  outlet: one(outlets, {
    fields: [shifts.outletId],
    references: [outlets.id],
  }),
  terminal: one(posTerminals, {
    fields: [shifts.terminalId],
    references: [posTerminals.id],
  }),
  cashDrops: many(cashDrops),
}));
