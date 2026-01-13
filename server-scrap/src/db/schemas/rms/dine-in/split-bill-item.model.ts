import { pgTable, integer, real, uuid, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { splitBills } from "./split-bill.model";

export const splitBillItems = pgTable("split_bill_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  splitBillId: uuid("split_bill_id")
    .notNull()
    .references(() => splitBills.id, { onDelete: "cascade" }),
  orderItemId: text("order_item_id").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  amount: real("amount").notNull(),
});

export const splitBillItemsRelations = relations(splitBillItems, ({ one }) => ({
  splitBill: one(splitBills, {
    fields: [splitBillItems.splitBillId],
    references: [splitBills.id],
  }),
}));
