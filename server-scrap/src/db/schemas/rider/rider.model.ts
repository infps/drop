import { pgTable, text, boolean, real, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { VehicleType } from "../enums";
import { riderEarnings } from "./rider-earning.model";
import { riderShifts } from "./rider-shift.model";

export const riders = pgTable("riders", {
  id: uuid("id").primaryKey().defaultRandom(),
  phone: text("phone").unique().notNull(),
  email: text("email"),
  name: text("name").notNull(),
  avatar: text("avatar"),

  // Documents
  documentVerified: boolean("document_verified").default(false).notNull(),
  policeVerified: boolean("police_verified").default(false).notNull(),
  alcoholAuthorized: boolean("alcohol_authorized").default(false).notNull(),

  // Vehicle
  vehicleType: text("vehicle_type").notNull().$type<VehicleType>(),
  vehicleNumber: text("vehicle_number"),

  // Status
  isOnline: boolean("is_online").default(false).notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  currentLat: real("current_lat"),
  currentLng: real("current_lng"),

  // Performance
  rating: real("rating").default(5).notNull(),
  totalDeliveries: integer("total_deliveries").default(0).notNull(),
  totalEarnings: real("total_earnings").default(0).notNull(),

  // Zone
  assignedZone: text("assigned_zone"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const ridersRelations = relations(riders, ({ many }) => ({
  earnings: many(riderEarnings),
  shifts: many(riderShifts),
}));
