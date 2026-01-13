import { pgTable, text, boolean, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { giftCardTransactions } from "./gift-card-transaction.model";

export const giftCards = pgTable("gift_cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: text("vendor_id").notNull(),
  cardNumber: text("card_number").unique().notNull(),
  pin: text("pin"),

  initialValue: real("initial_value").notNull(),
  currentBalance: real("current_balance").notNull(),

  purchasedAt: timestamp("purchased_at", { mode: "date" }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }),

  // Purchaser
  purchaserName: text("purchaser_name"),
  purchaserEmail: text("purchaser_email"),

  // Recipient
  recipientName: text("recipient_name"),
  recipientEmail: text("recipient_email"),
  message: text("message"),

  isActive: boolean("is_active").default(true).notNull(),
});

export const giftCardsRelations = relations(giftCards, ({ many }) => ({
  transactions: many(giftCardTransactions),
}));
