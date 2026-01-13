import { pgTable, text, boolean, real, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { EmployeeRole } from "../../enums";
import { outlets } from "../outlet/outlet.model";
import { employeeSchedules } from "./employee-schedule.model";
import { timeEntries } from "./time-entry.model";

export const employees = pgTable("employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: text("vendor_id").notNull(),
  outletId: uuid("outlet_id").references(() => outlets.id),

  // Basic info
  employeeCode: text("employee_code").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  avatar: text("avatar"),

  // Employment
  role: text("role").notNull().$type<EmployeeRole>(),
  department: text("department"),
  hireDate: timestamp("hire_date", { mode: "date" }).defaultNow().notNull(),
  terminationDate: timestamp("termination_date", { mode: "date" }),

  // Authentication
  pin: text("pin"),
  passwordHash: text("password_hash"),

  // Permissions
  permissions: text("permissions").array().default([]).notNull(),

  // Pay
  hourlyRate: real("hourly_rate"),
  salary: real("salary"),

  // Status
  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => ({
  unq: unique().on(table.vendorId, table.employeeCode),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  outlet: one(outlets, {
    fields: [employees.outletId],
    references: [outlets.id],
  }),
  schedules: many(employeeSchedules),
  timeEntries: many(timeEntries),
}));
