import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { TransferStatus } from "../../enums";
import { stockTransferItems } from "./stock-transfer-item.model";

export const stockTransfers = pgTable("stock_transfers", {
  id: uuid("id").primaryKey().defaultRandom(),
  transferNumber: text("transfer_number").unique().notNull(),
  fromOutletId: text("from_outlet_id").notNull(),
  toOutletId: text("to_outlet_id").notNull(),

  status: text("status").default("DRAFT").notNull().$type<TransferStatus>(),

  requestedAt: timestamp("requested_at", { mode: "date" }).defaultNow().notNull(),
  shippedAt: timestamp("shipped_at", { mode: "date" }),
  receivedAt: timestamp("received_at", { mode: "date" }),

  requestedByEmployeeId: text("requested_by_employee_id").notNull(),

  notes: text("notes"),
});

export const stockTransfersRelations = relations(stockTransfers, ({ many }) => ({
  items: many(stockTransferItems),
}));
