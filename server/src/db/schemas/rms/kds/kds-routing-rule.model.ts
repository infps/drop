import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { kdsStations } from "./kds-station.model";

export const kdsRoutingRules = pgTable("kds_routing_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  stationId: uuid("station_id").notNull().references(() => kdsStations.id, { onDelete: "cascade" }),
  categoryId: text("category_id"),
  menuItemId: text("menu_item_id"),
});

export const kdsRoutingRulesRelations = relations(kdsRoutingRules, ({ one }) => ({
  station: one(kdsStations, {
    fields: [kdsRoutingRules.stationId],
    references: [kdsStations.id],
  }),
}));
