import { pgTable, text, boolean, real, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { SensorType } from "../../enums";
import { sensorReadings } from "./sensor-reading.model";

export const iotSensors = pgTable("iot_sensors", {
  id: uuid("id").primaryKey().defaultRandom(),
  outletId: text("outlet_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull().$type<SensorType>(),
  location: text("location"),

  // Thresholds
  minThreshold: real("min_threshold"),
  maxThreshold: real("max_threshold"),

  isActive: boolean("is_active").default(true).notNull(),
});

export const iotSensorsRelations = relations(iotSensors, ({ many }) => ({
  readings: many(sensorReadings),
}));
