import { pgTable, text, boolean, real, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { modifierGroups } from "./modifier-group.model";

export const modifiers = pgTable("modifiers", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id").notNull().references(() => modifierGroups.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: real("price").default(0).notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const modifiersRelations = relations(modifiers, ({ one }) => ({
  group: one(modifierGroups, {
    fields: [modifiers.groupId],
    references: [modifierGroups.id],
  }),
}));
