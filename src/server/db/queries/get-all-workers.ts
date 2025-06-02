import { db } from "~/server/db";
import { workers } from "~/server/db/schema";
import { type Worker } from "~/server/db/types";

export async function getAllWorkers(): Promise<Worker[]> {
  const allWorkers = await db.select().from(workers);
  return allWorkers;
}
