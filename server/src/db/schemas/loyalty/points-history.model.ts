import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { PointsType } from "../enums";
import { loyaltyPoints } from "./loyalty-points.model";

export const pointsHistory = pgTable("points_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  loyaltyPointsId: uuid("loyalty_points_id").notNull().references(() => loyaltyPoints.id, { onDelete: "cascade" }),
  points: integer("points").notNull(),
  type: text("type").notNull().$type<PointsType>(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const pointsHistoryRelations = relations(pointsHistory, ({ one }) => ({
  loyaltyPoints: one(loyaltyPoints, {
    fields: [pointsHistory.loyaltyPointsId],
    references: [loyaltyPoints.id],
  }),
}));
