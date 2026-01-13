import { pgTable, text, boolean, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { PrinterType, ConnectionType } from "../../enums";
import { outlets } from "../outlet/outlet.model";

export const printers = pgTable("printers", {
  id: uuid("id").primaryKey().defaultRandom(),
  outletId: uuid("outlet_id").notNull().references(() => outlets.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull().$type<PrinterType>(),

  // Connection
  connectionType: text("connection_type").notNull().$type<ConnectionType>(),
  ipAddress: text("ip_address"),
  port: integer("port"),

  isActive: boolean("is_active").default(true).notNull(),
});

export const printersRelations = relations(printers, ({ one }) => ({
  outlet: one(outlets, {
    fields: [printers.outletId],
    references: [outlets.id],
  }),
}));
