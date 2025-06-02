import { relations } from "drizzle-orm/relations";
import { workers, wards, households, scanlogs, citizenreports } from "./schema";

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
  ward: one(wards, {
    fields: [workers.wardId],
    references: [wards.wardId],
    relationName: "workers_wardId_wards_wardId",
  }),
  scanlogs: many(scanlogs),
}));

export const householdsRelations = relations(households, ({ one, many }) => ({
  ward: one(wards, {
    fields: [households.wardId],
    references: [wards.wardId],
  }),
  scanlogs: many(scanlogs),
  citizenreports: many(citizenreports),
}));

export const scanlogsRelations = relations(scanlogs, ({ one }) => ({
  household: one(households, {
    fields: [scanlogs.nfcId],
    references: [households.nfcId],
  }),
  worker: one(workers, {
    fields: [scanlogs.workerId],
    references: [workers.workerId],
  }),
}));

export const citizenreportsRelations = relations(citizenreports, ({ one }) => ({
  household: one(households, {
    fields: [citizenreports.nfcId],
    references: [households.nfcId],
  }),
}));
