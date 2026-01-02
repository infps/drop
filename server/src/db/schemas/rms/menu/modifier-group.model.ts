import { pgTable, text, boolean, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { modifiers } from "./modifier.model";
import { menuItemModifierGroups } from "./menu-item-modifier-group.model";

export const modifierGroups = pgTable("modifier_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: text("vendor_id").notNull(),
  name: text("name").notNull(),

  // Rules
  minSelections: integer("min_selections").default(0).notNull(),
  maxSelections: integer("max_selections").default(1).notNull(),
  isRequired: boolean("is_required").default(false).notNull(),
});

export const modifierGroupsRelations = relations(modifierGroups, ({ many }) => ({
  modifiers: many(modifiers),
  menuItemLinks: many(menuItemModifierGroups),
}));
