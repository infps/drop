import { pgTable, text, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { TransactionType } from "../enums";
import { wallets } from "./wallet.model";

export const walletTransactions = pgTable("wallet_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletId: uuid("wallet_id").notNull().references(() => wallets.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  type: text("type").notNull().$type<TransactionType>(),
  description: text("description"),
  orderId: text("order_id"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const walletTransactionsRelations = relations(walletTransactions, ({ one }) => ({
  wallet: one(wallets, {
    fields: [walletTransactions.walletId],
    references: [wallets.id],
  }),
}));
