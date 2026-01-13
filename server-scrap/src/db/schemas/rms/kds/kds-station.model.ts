import { pgTable, text, boolean, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { StationType } from "../../enums";
import { outlets } from "../outlet/outlet.model";
import { kdsTickets } from "./kds-ticket.model";
import { kdsRoutingRules } from "./kds-routing-rule.model";

export const kdsStations = pgTable("kds_stations", {
  id: uuid("id").primaryKey().defaultRandom(),
  outletId: uuid("outlet_id").notNull().references(() => outlets.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  stationType: text("station_type").notNull().$type<StationType>(),
  displayOrder: integer("display_order").default(0).notNull(),

  // Settings
  defaultPrepTime: integer("default_prep_time").default(15).notNull(),
  alertThreshold: integer("alert_threshold").default(10).notNull(),

  isActive: boolean("is_active").default(true).notNull(),
});

export const kdsStationsRelations = relations(kdsStations, ({ one, many }) => ({
  outlet: one(outlets, {
    fields: [kdsStations.outletId],
    references: [outlets.id],
  }),
  tickets: many(kdsTickets),
  routingRules: many(kdsRoutingRules),
}));
