import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { SubscriptionPlan } from "../enums";
import { users } from "../user/user.model";

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").unique().notNull().references(() => users.id, { onDelete: "cascade" }),
  plan: text("plan").notNull().$type<SubscriptionPlan>(),
  startDate: timestamp("start_date", { mode: "date" }).defaultNow().notNull(),
  endDate: timestamp("end_date", { mode: "date" }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));
