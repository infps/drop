import { pgTable, text, boolean, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { outlets } from "../outlet/outlet.model";
import { tables } from "./table.model";
import { tableZones } from "./table-zone.model";

export const floors = pgTable("floors", {
  id: uuid("id").primaryKey().defaultRandom(),
  outletId: uuid("outlet_id").notNull().references(() => outlets.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const floorsRelations = relations(floors, ({ one, many }) => ({
  outlet: one(outlets, {
    fields: [floors.outletId],
    references: [outlets.id],
  }),
  tables: many(tables),
  zones: many(tableZones),
}));
