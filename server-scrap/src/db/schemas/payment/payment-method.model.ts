import { pgTable, text, boolean, jsonb, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { PaymentType } from "../enums";
import { users } from "../user/user.model";

export const paymentMethods = pgTable("payment_methods", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull().$type<PaymentType>(),
  details: jsonb("details").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
});

export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  user: one(users, {
    fields: [paymentMethods.userId],
    references: [users.id],
  }),
}));
