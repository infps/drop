import { pgTable, boolean, real, uuid, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { partyEvents } from "./party-event.model";
import { users } from "../user/user.model";

export const partyParticipants = pgTable("party_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  partyEventId: uuid("party_event_id").notNull().references(() => partyEvents.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id),
  shareAmount: real("share_amount"),
  hasPaid: boolean("has_paid").default(false).notNull(),
}, (table) => ({
  unq: unique().on(table.partyEventId, table.userId),
}));

export const partyParticipantsRelations = relations(partyParticipants, ({ one }) => ({
  partyEvent: one(partyEvents, {
    fields: [partyParticipants.partyEventId],
    references: [partyEvents.id],
  }),
  user: one(users, {
    fields: [partyParticipants.userId],
    references: [users.id],
  }),
}));
