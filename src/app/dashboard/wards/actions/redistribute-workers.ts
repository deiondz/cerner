"use server";

import { db } from "~/server/db";
import { workers, wards } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function redistributeWorkers() {
  try {
    // Get all workers and wards
    const allWorkers = await db.select().from(workers);
    const allWards = await db.select().from(wards);

    if (allWards.length === 0) {
      throw new Error("No wards found in the system");
    }

    // Randomly assign workers to wards
    for (const worker of allWorkers) {
      const randomWardIndex = Math.floor(Math.random() * allWards.length);
      const randomWard = allWards[randomWardIndex];

      // Update worker's ward assignment
      await db
        .update(workers)
        .set({ wardId: randomWard?.wardId })
        .where(eq(workers.workerId, worker.workerId));
    }

    return {
      success: true,
      message: "Workers have been redistributed successfully",
    };
  } catch (error) {
    console.error("Error redistributing workers:", error);
    return { success: false, message: "Failed to redistribute workers" };
  }
}
