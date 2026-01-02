import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { PartyStatus, SplitType } from "../enums";
import { users } from "../user/user.model";
import { partyParticipants } from "./party-participant.model";

export const partyEvents = pgTable("party_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  hostUserId: uuid("host_user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  scheduledFor: timestamp("scheduled_for", { mode: "date" }).notNull(),
  status: text("status").default("PLANNING").notNull().$type<PartyStatus>(),

  // Split billing
  splitType: text("split_type").default("EQUAL").notNull().$type<SplitType>(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const partyEventsRelations = relations(partyEvents, ({ one, many }) => ({
  host: one(users, {
    fields: [partyEvents.hostUserId],
    references: [users.id],
  }),
  participants: many(partyParticipants),
}));
