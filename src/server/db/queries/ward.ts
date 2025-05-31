import { db } from "../index";
import { wards, workers, households } from "../schema";
import { eq, sql } from "drizzle-orm";
import type { Ward } from "~/types/ward";

export async function getWards(): Promise<Ward[]> {
  const wardsWithDetails = await db
    .select({
      ward_code: wards.wardCode,
      name: wards.name,
      supervisor_id: wards.supervisorId,
      supervisor_name: workers.name,
      worker_count: sql<number>`COUNT(DISTINCT ${workers.workerId})`,
      household_count: sql<number>`COUNT(DISTINCT ${households.nfcId})`,
      status: sql<"active" | "inactive">`CASE 
        WHEN ${wards.supervisorId} IS NOT NULL THEN 'active'::text 
        ELSE 'inactive'::text 
      END`,
    })
    .from(wards)
    .leftJoin(workers, eq(wards.supervisorId, workers.workerId))
    .leftJoin(households, eq(wards.wardCode, households.wardCode))
    .groupBy(wards.wardCode, wards.name, wards.supervisorId, workers.name);

  const typedWards = wardsWithDetails.map((ward) => ({
    ...ward,
    supervisor_id: ward.supervisor_id ?? "",
    supervisor_name: ward.supervisor_name ?? "",
  }));

  return typedWards;
}

export async function getWardById(wardCode: string): Promise<Ward | null> {
  const ward = await db
    .select({
      ward_code: wards.wardCode,
      name: wards.name,
      supervisor_id: wards.supervisorId,
      supervisor_name: workers.name,
      worker_count: sql<number>`COUNT(DISTINCT ${workers.workerId})`,
      household_count: sql<number>`COUNT(DISTINCT ${households.nfcId})`,
      status: sql<"active" | "inactive">`CASE 
        WHEN ${wards.supervisorId} IS NOT NULL THEN 'active'::text 
        ELSE 'inactive'::text 
      END`,
    })
    .from(wards)
    .leftJoin(workers, eq(wards.supervisorId, workers.workerId))
    .leftJoin(households, eq(wards.wardCode, households.wardCode))
    .where(eq(wards.wardCode, wardCode))
    .groupBy(wards.wardCode, wards.name, wards.supervisorId, workers.name);

  const typedWard = ward[0]
    ? {
        ...ward[0],
        supervisor_id: ward[0].supervisor_id ?? "",
        supervisor_name: ward[0].supervisor_name ?? "",
      }
    : null;

  return typedWard;
}
