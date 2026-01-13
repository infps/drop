import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { ScheduleStatus } from "../../enums";
import { employees } from "./employee.model";

export const employeeSchedules = pgTable("employee_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  outletId: text("outlet_id").notNull(),

  date: timestamp("date", { mode: "date" }).notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),

  role: text("role"),
  notes: text("notes"),

  status: text("status").default("SCHEDULED").notNull().$type<ScheduleStatus>(),
});

export const employeeSchedulesRelations = relations(employeeSchedules, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeSchedules.employeeId],
    references: [employees.id],
  }),
}));
