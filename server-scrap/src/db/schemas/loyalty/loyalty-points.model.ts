import { pgTable, text, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { LoyaltyTier } from "../enums";
import { users } from "../user/user.model";
import { pointsHistory } from "./points-history.model";

export const loyaltyPoints = pgTable("loyalty_points", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").unique().notNull().references(() => users.id, { onDelete: "cascade" }),
  points: integer("points").default(0).notNull(),
  lifetimePoints: integer("lifetime_points").default(0).notNull(),
  tier: text("tier").default("BRONZE").notNull().$type<LoyaltyTier>(),
});

export const loyaltyPointsRelations = relations(loyaltyPoints, ({ one, many }) => ({
  user: one(users, {
    fields: [loyaltyPoints.userId],
    references: [users.id],
  }),
  history: many(pointsHistory),
}));
