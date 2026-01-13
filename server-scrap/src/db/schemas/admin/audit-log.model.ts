import { pgTable, text, jsonb, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { admins } from "./admin.model";

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id").notNull().references(() => admins.id),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  details: jsonb("details"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  admin: one(admins, {
    fields: [auditLogs.adminId],
    references: [admins.id],
  }),
}));
