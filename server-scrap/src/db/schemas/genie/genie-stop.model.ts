import { pgTable, text, integer, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { StopType } from "../enums";
import { genieOrders } from "./genie-order.model";

export const genieStops = pgTable("genie_stops", {
  id: uuid("id").primaryKey().defaultRandom(),
  genieOrderId: uuid("genie_order_id").notNull().references(() => genieOrders.id, { onDelete: "cascade" }),
  stopNumber: integer("stop_number").notNull(),
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  contactName: text("contact_name"),
  contactPhone: text("contact_phone"),
  instructions: text("instructions"),
  type: text("type").notNull().$type<StopType>(),
  completedAt: timestamp("completed_at", { mode: "date" }),
});

export const genieStopsRelations = relations(genieStops, ({ one }) => ({
  genieOrder: one(genieOrders, {
    fields: [genieStops.genieOrderId],
    references: [genieOrders.id],
  }),
}));
