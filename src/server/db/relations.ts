import { relations } from "drizzle-orm/relations";
import { wards, workers, households, scanlogs, citizenreports } from "./schema";

export const workersRelations = relations(workers, ({ one, many }) => ({
  ward_workerId: one(wards, {
    fields: [workers.workerId],
    references: [wards.supervisorId],
    relationName: "workers_workerId_wards_supervisorId",
  }),
  ward_wardAssigned: one(wards, {
    fields: [workers.wardAssigned],
    references: [wards.wardCode],
    relationName: "workers_wardAssigned_wards_wardCode",
  }),
  scanlogs: many(scanlogs),
}));

export const wardsRelations = relations(wards, ({ many }) => ({
  workers_workerId: many(workers, {
    relationName: "workers_workerId_wards_supervisorId",
  }),
  workers_wardAssigned: many(workers, {
    relationName: "workers_wardAssigned_wards_wardCode",
  }),
  households: many(households),
}));

export const householdsRelations = relations(households, ({ one, many }) => ({
  ward: one(wards, {
    fields: [households.wardCode],
    references: [wards.wardCode],
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
