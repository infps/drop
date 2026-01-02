import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { guestProfiles } from "./guest-profile.model";

export const guestFeedbacks = pgTable("guest_feedbacks", {
  id: uuid("id").primaryKey().defaultRandom(),
  guestProfileId: uuid("guest_profile_id").references(() => guestProfiles.id),
  outletId: text("outlet_id").notNull(),
  orderId: text("order_id"),

  // Ratings
  overallRating: integer("overall_rating").notNull(),
  foodRating: integer("food_rating"),
  serviceRating: integer("service_rating"),
  ambienceRating: integer("ambience_rating"),

  comments: text("comments"),

  // Response
  respondedAt: timestamp("responded_at", { mode: "date" }),
  response: text("response"),
  respondedByEmployeeId: text("responded_by_employee_id"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const guestFeedbacksRelations = relations(guestFeedbacks, ({ one }) => ({
  guestProfile: one(guestProfiles, {
    fields: [guestFeedbacks.guestProfileId],
    references: [guestProfiles.id],
  }),
}));
