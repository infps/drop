import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { AdminRole } from "../enums";
import { auditLogs } from "./audit-log.model";

export const admins = pgTable("admins", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").default("SUPPORT").notNull().$type<AdminRole>(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const adminsRelations = relations(admins, ({ many }) => ({
  auditLogs: many(auditLogs),
}));
