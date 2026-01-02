import { pgTable, text, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { GiftCardTxType } from "../../enums";
import { giftCards } from "./gift-card.model";

export const giftCardTransactions = pgTable("gift_card_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  giftCardId: uuid("gift_card_id").notNull().references(() => giftCards.id, { onDelete: "cascade" }),

  type: text("type").notNull().$type<GiftCardTxType>(),
  amount: real("amount").notNull(),
  balance: real("balance").notNull(),

  orderId: text("order_id"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const giftCardTransactionsRelations = relations(giftCardTransactions, ({ one }) => ({
  giftCard: one(giftCards, {
    fields: [giftCardTransactions.giftCardId],
    references: [giftCards.id],
  }),
}));
