import { pgTable, text, integer, real, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { loyaltyPrograms } from "./loyalty-program.model";

export const loyaltyProgramTiers = pgTable("loyalty_program_tiers", {
  id: uuid("id").primaryKey().defaultRandom(),
  programId: uuid("program_id").notNull().references(() => loyaltyPrograms.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  minPoints: integer("min_points").notNull(),
  multiplier: real("multiplier").default(1).notNull(),
  benefits: text("benefits").array().default([]).notNull(),
});

export const loyaltyProgramTiersRelations = relations(loyaltyProgramTiers, ({ one }) => ({
  program: one(loyaltyPrograms, {
    fields: [loyaltyProgramTiers.programId],
    references: [loyaltyPrograms.id],
  }),
}));
