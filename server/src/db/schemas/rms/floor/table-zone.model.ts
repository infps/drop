import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { floors } from "./floor.model";
import { tables } from "./table.model";

export const tableZones = pgTable("table_zones", {
  id: uuid("id").primaryKey().defaultRandom(),
  floorId: uuid("floor_id").notNull().references(() => floors.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color").default("#f97316").notNull(),
});

export const tableZonesRelations = relations(tableZones, ({ one, many }) => ({
  floor: one(floors, {
    fields: [tableZones.floorId],
    references: [floors.id],
  }),
  tables: many(tables),
}));
