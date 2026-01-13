import { pgTable, text, boolean, jsonb, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { NotificationType } from "../enums";
import { users } from "../user/user.model";

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: text("type").notNull().$type<NotificationType>(),
  data: jsonb("data"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
