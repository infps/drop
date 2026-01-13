import { pgTable, boolean, uuid, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { outlets } from "../outlet/outlet.model";
import { menuSets } from "./menu-set.model";

export const outletMenuAssignments = pgTable("outlet_menu_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  outletId: uuid("outlet_id").notNull().references(() => outlets.id, { onDelete: "cascade" }),
  menuSetId: uuid("menu_set_id").notNull().references(() => menuSets.id, { onDelete: "cascade" }),
  isActive: boolean("is_active").default(true).notNull(),
}, (table) => ({
  unq: unique().on(table.outletId, table.menuSetId),
}));

export const outletMenuAssignmentsRelations = relations(outletMenuAssignments, ({ one }) => ({
  outlet: one(outlets, {
    fields: [outletMenuAssignments.outletId],
    references: [outlets.id],
  }),
  menuSet: one(menuSets, {
    fields: [outletMenuAssignments.menuSetId],
    references: [menuSets.id],
  }),
}));
