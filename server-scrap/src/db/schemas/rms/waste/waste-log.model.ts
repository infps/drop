import { pgTable, text, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { wasteLogItems } from "./waste-log-item.model";

export const wasteLogs = pgTable("waste_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: text("vendor_id").notNull(),
  outletId: text("outlet_id").notNull(),

  date: timestamp("date", { mode: "date" }).defaultNow().notNull(),

  loggedByEmployeeId: text("logged_by_employee_id").notNull(),

  totalValue: real("total_value").default(0).notNull(),

  notes: text("notes"),
});

export const wasteLogsRelations = relations(wasteLogs, ({ many }) => ({
  items: many(wasteLogItems),
}));
