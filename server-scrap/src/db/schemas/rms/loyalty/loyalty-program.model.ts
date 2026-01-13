import { pgTable, text, boolean, real, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { loyaltyProgramTiers } from "./loyalty-program-tier.model";
import { loyaltyRewards } from "./loyalty-reward.model";

export const loyaltyPrograms = pgTable("loyalty_programs", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: text("vendor_id").notNull(),
  name: text("name").notNull(),

  // Points earning
  pointsPerCurrency: real("points_per_currency").default(1).notNull(),

  isActive: boolean("is_active").default(true).notNull(),
});

export const loyaltyProgramsRelations = relations(loyaltyPrograms, ({ many }) => ({
  tiers: many(loyaltyProgramTiers),
  rewards: many(loyaltyRewards),
}));
