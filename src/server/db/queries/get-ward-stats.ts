import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { households, wards, workers } from "~/server/db/schema";

export async function getWardStats() {
  const [workerStats, householdStats, wardStats] = await Promise.all([
    db
      .select({
        totalWorkers: sql<number>`count(${workers.workerId})`,
      })
      .from(workers),
    db
      .select({
        totalHouseholds: sql<number>`count(${households.houseId})`,
      })
      .from(households),
    db
      .select({
        totalWards: sql<number>`count(${wards.wardId})`,
      })
      .from(wards),
  ]);

  return {
    totalWorkers: workerStats[0]?.totalWorkers ?? 0,
    totalHouseholds: householdStats[0]?.totalHouseholds ?? 0,
    totalWards: wardStats[0]?.totalWards ?? 0,
  };
}
