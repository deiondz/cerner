import { db } from "~/server/db";
import { wards } from "~/server/db/schema";
import { type Ward } from "~/server/db/types";

export async function getAllWards(): Promise<Ward[]> {
  const allWards = await db.select().from(wards);
  return allWards.map((ward) => ({
    ...ward,
    createdAt: ward.createdAt ?? "",
  }));
}
