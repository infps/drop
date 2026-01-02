import { pgTable, integer, uuid, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { menuItems } from "./menu-item.model";
import { modifierGroups } from "./modifier-group.model";

export const menuItemModifierGroups = pgTable("menu_item_modifier_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  menuItemId: uuid("menu_item_id").notNull().references(() => menuItems.id, { onDelete: "cascade" }),
  modifierGroupId: uuid("modifier_group_id").notNull().references(() => modifierGroups.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").default(0).notNull(),
}, (table) => ({
  unq: unique().on(table.menuItemId, table.modifierGroupId),
}));

export const menuItemModifierGroupsRelations = relations(menuItemModifierGroups, ({ one }) => ({
  menuItem: one(menuItems, {
    fields: [menuItemModifierGroups.menuItemId],
    references: [menuItems.id],
  }),
  modifierGroup: one(modifierGroups, {
    fields: [menuItemModifierGroups.modifierGroupId],
    references: [modifierGroups.id],
  }),
}));
