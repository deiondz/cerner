import { relations } from "drizzle-orm/relations";
import {
  workers,
  wards,
  households,
  scanlogs,
  citizenreports,
  tracker,
} from "./schema";

export const wardsRelations = relations(wards, ({ one, many }) => ({
  worker: one(workers, {
    fields: [wards.supervisorId],
    references: [workers.workerId],
    relationName: "wards_supervisorId_workers_workerId",
  }),
  households: many(households),
  workers: many(workers, {
    relationName: "workers_wardId_wards_wardId",
  }),
}));

export const workersRelations = relations(workers, ({ one, many }) => ({
  wards: many(wards, {
    relationName: "wards_supervisorId_workers_workerId",
  }),
  scanlogs: many(scanlogs),
  ward: one(wards, {
    fields: [workers.wardId],
    references: [wards.wardId],
    relationName: "workers_wardId_wards_wardId",
  }),
}));

export const householdsRelations = relations(households, ({ one, many }) => ({
  ward: one(wards, {
    fields: [households.wardId],
    references: [wards.wardId],
  }),
  scanlogs: many(scanlogs),
  citizenreports: many(citizenreports),
  trackers: many(tracker),
}));

export const scanlogsRelations = relations(scanlogs, ({ one }) => ({
  household: one(households, {
    fields: [scanlogs.houseId],
    references: [households.houseId],
  }),
  worker: one(workers, {
    fields: [scanlogs.workerId],
    references: [workers.workerId],
  }),
}));

export const citizenreportsRelations = relations(citizenreports, ({ one }) => ({
  household: one(households, {
    fields: [citizenreports.nfcId],
    references: [households.houseId],
  }),
}));

export const trackerRelations = relations(tracker, ({ one }) => ({
  household: one(households, {
    fields: [tracker.houseId],
    references: [households.houseId],
  }),
}));
