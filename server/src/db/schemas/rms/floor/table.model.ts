import { pgTable, text, boolean, integer, real, uuid, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { TableShape, TableStatus } from "../../enums";
import { outlets } from "../outlet/outlet.model";
import { floors } from "./floor.model";
import { tableZones } from "./table-zone.model";
import { tableSessions } from "./table-session.model";

export const tables = pgTable("tables", {
  id: uuid("id").primaryKey().defaultRandom(),
  outletId: uuid("outlet_id").notNull().references(() => outlets.id, { onDelete: "cascade" }),
  floorId: uuid("floor_id").references(() => floors.id),
  zoneId: uuid("zone_id").references(() => tableZones.id),
  tableNumber: text("table_number").notNull(),
  capacity: integer("capacity").default(4).notNull(),
  minCapacity: integer("min_capacity").default(1).notNull(),
  shape: text("shape").default("RECTANGLE").notNull().$type<TableShape>(),

  // Position on floor map
  positionX: real("position_x").default(0).notNull(),
  positionY: real("position_y").default(0).notNull(),
  width: real("width").default(100).notNull(),
  height: real("height").default(100).notNull(),
  rotation: real("rotation").default(0).notNull(),

  // Status
  status: text("status").default("AVAILABLE").notNull().$type<TableStatus>(),
  currentOrderId: text("current_order_id"),

  isActive: boolean("is_active").default(true).notNull(),
}, (table) => ({
  unq: unique().on(table.outletId, table.tableNumber),
}));

export const tablesRelations = relations(tables, ({ one, many }) => ({
  outlet: one(outlets, {
    fields: [tables.outletId],
    references: [outlets.id],
  }),
  floor: one(floors, {
    fields: [tables.floorId],
    references: [floors.id],
  }),
  zone: one(tableZones, {
    fields: [tables.zoneId],
    references: [tableZones.id],
  }),
  sessions: many(tableSessions),
}));
