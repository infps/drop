import { pgTable, boolean, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { iotSensors } from "./iot-sensor.model";

export const sensorReadings = pgTable("sensor_readings", {
  id: uuid("id").primaryKey().defaultRandom(),
  sensorId: uuid("sensor_id").notNull().references(() => iotSensors.id, { onDelete: "cascade" }),

  value: real("value").notNull(),
  isAlert: boolean("is_alert").default(false).notNull(),

  timestamp: timestamp("timestamp", { mode: "date" }).defaultNow().notNull(),
});

export const sensorReadingsRelations = relations(sensorReadings, ({ one }) => ({
  sensor: one(iotSensors, {
    fields: [sensorReadings.sensorId],
    references: [iotSensors.id],
  }),
}));
