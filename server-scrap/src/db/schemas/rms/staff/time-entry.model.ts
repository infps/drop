import { pgTable, text, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { TimeEntryStatus } from "../../enums";
import { employees } from "./employee.model";

export const timeEntries = pgTable("time_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  outletId: text("outlet_id").notNull(),

  clockIn: timestamp("clock_in", { mode: "date" }).notNull(),
  clockOut: timestamp("clock_out", { mode: "date" }),

  // Breaks
  breakStart: timestamp("break_start", { mode: "date" }),
  breakEnd: timestamp("break_end", { mode: "date" }),

  // Calculated
  regularHours: real("regular_hours"),
  overtimeHours: real("overtime_hours"),

  // Approval
  status: text("status").default("PENDING").notNull().$type<TimeEntryStatus>(),
  approvedByEmployeeId: text("approved_by_employee_id"),

  notes: text("notes"),
});

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  employee: one(employees, {
    fields: [timeEntries.employeeId],
    references: [employees.id],
  }),
}));
