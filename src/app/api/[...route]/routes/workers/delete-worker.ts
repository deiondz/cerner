import { Hono } from "hono";

// ** Import DB

// ** Import Drizzle
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { wards, workers } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

// Create a new Hono app
const app = new Hono();

// DELETE /api/workers/:id
app.delete("/", async (c) => {
  try {
    // Parse and validate ward ID
    const id = c.req.param("id");
    if (!id) {
      return c.json(
        {
          success: false,
          error: "Worker ID is required",
        },
        400,
      );
    }

    // Check if worker exists
    const [worker] = await db
      .select()
      .from(workers)
      .where(eq(workers.workerId, id));

    if (!worker) {
      return c.json(
        {
          success: false,
          error: "Worker not found",
        },
        404,
      );
    }

    // Then delete the worker
    await db.delete(workers).where(eq(workers.workerId, id));
    revalidatePath("/dashboard/workers");
    return c.json(
      {
        success: true,
        message: "Worker deleted successfully",
      },
      200,
    );
  } catch (error) {
    console.error("Error deleting worker:", error);
    return c.json(
      {
        success: false,
        error: "Failed to delete ward",
        details: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

export default app;
