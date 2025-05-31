import { relations } from "drizzle-orm/relations";
import { workers, wards, households, scanlogs, citizenreports } from "./schema";

export const wardsRelations = relations(wards, ({one, many}) => ({
	worker: one(workers, {
		fields: [wards.supervisorId],
		references: [workers.workerId]
	}),
	households: many(households),
}));

export const workersRelations = relations(workers, ({many}) => ({
	wards: many(wards),
	scanlogs: many(scanlogs),
}));

export const householdsRelations = relations(households, ({one, many}) => ({
	ward: one(wards, {
		fields: [households.wardCode],
		references: [wards.wardCode]
	}),
	scanlogs: many(scanlogs),
	citizenreports: many(citizenreports),
}));

export const scanlogsRelations = relations(scanlogs, ({one}) => ({
	household: one(households, {
		fields: [scanlogs.nfcId],
		references: [households.nfcId]
	}),
	worker: one(workers, {
		fields: [scanlogs.workerId],
		references: [workers.workerId]
	}),
}));

export const citizenreportsRelations = relations(citizenreports, ({one}) => ({
	household: one(households, {
		fields: [citizenreports.nfcId],
		references: [households.nfcId]
	}),
}));