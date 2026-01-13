import { pgTable, real, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../user/user.model";
import { walletTransactions } from "./wallet-transaction.model";

export const wallets = pgTable("wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").unique().notNull().references(() => users.id, { onDelete: "cascade" }),
  balance: real("balance").default(0).notNull(),
});

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
  transactions: many(walletTransactions),
}));
