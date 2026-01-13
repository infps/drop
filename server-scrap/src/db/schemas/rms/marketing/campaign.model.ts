import { pgTable, text, integer, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { CampaignType, CampaignChannel, CampaignStatus } from "../../enums";

export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: text("vendor_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),

  type: text("type").notNull().$type<CampaignType>(),
  channel: text("channel").notNull().$type<CampaignChannel>(),

  // Content
  subject: text("subject"),
  content: text("content").notNull(),

  // Targeting
  segmentRules: jsonb("segment_rules"),

  // Schedule
  scheduledAt: timestamp("scheduled_at", { mode: "date" }),
  sentAt: timestamp("sent_at", { mode: "date" }),

  // Stats
  totalSent: integer("total_sent").default(0).notNull(),
  totalOpened: integer("total_opened").default(0).notNull(),
  totalClicked: integer("total_clicked").default(0).notNull(),
  totalConverted: integer("total_converted").default(0).notNull(),

  status: text("status").default("DRAFT").notNull().$type<CampaignStatus>(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
