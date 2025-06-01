"use server";

import { db } from "~/server/db";
import { wards, workers, households } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";
import type { WardTableData } from "~/server/db/types";

export async function getWardTableData(): Promise<WardTableData[]> {
  const wardsData = await db
    .select({
      wardId: wards.wardId,
      wardName: wards.wardName,
      supervisorId: wards.supervisorId,
      supervisorName: workers.workerName,
      workerCount: sql<number>`(
        SELECT COUNT(*) 
        FROM ${workers} 
        WHERE ${workers.wardId} = ${wards.wardId}
      )`,
      householdCount: sql<number>`(
        SELECT COUNT(*) 
        FROM ${households} 
        WHERE ${households.wardId} = ${wards.wardId}
      )`,
    })
    .from(wards)
    .leftJoin(workers, eq(wards.supervisorId, workers.workerId));

  return wardsData.map((ward) => ({
    wardId: ward.wardId,
    wardName: ward.wardName,
    supervisorId: ward.supervisorId,
    supervisorName: ward.supervisorName,
    workerCount: ward.workerCount,
    householdCount: ward.householdCount,
  }));
}
