import { pgTable, text, boolean, integer, real, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { RewardType } from "../../enums";
import { loyaltyPrograms } from "./loyalty-program.model";

export const loyaltyRewards = pgTable("loyalty_rewards", {
  id: uuid("id").primaryKey().defaultRandom(),
  programId: uuid("program_id").notNull().references(() => loyaltyPrograms.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),

  pointsCost: integer("points_cost").notNull(),
  rewardType: text("reward_type").notNull().$type<RewardType>(),
  rewardValue: real("reward_value").notNull(),

  isActive: boolean("is_active").default(true).notNull(),
});

export const loyaltyRewardsRelations = relations(loyaltyRewards, ({ one }) => ({
  program: one(loyaltyPrograms, {
    fields: [loyaltyRewards.programId],
    references: [loyaltyPrograms.id],
  }),
}));
