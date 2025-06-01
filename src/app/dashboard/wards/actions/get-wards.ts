"use server";

import { db } from "~/server/db";
import { wards } from "~/server/db/schema";
import { type Ward } from "~/server/db/types";

export async function getWards(): Promise<Ward[]> {
  try {
    const allWards = await db.select().from(wards);
    return allWards;
  } catch (error) {
    console.error("Error fetching wards:", error);
    throw new Error("Failed to fetch wards");
  }
}
