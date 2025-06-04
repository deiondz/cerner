import { Hono } from "hono";

// ** Import 3rd Party Libs
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { wards, workers } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

// Create a new Hono app
const app = new Hono();

// Input validation schema
const updateWardSchema = z.object({
  workerId: z.string().uuid("Invalid worker ID"),
  workerName: z.string().min(1, "Worker name is required").max(255),
  contactNumber: z.string().min(1, "Contact number is required").max(255),
  wardId: z.string().uuid("Invalid ward ID").optional(),
  status: z.boolean().optional(),
});

// POST /api/users/add
app.put("/", async (c) => {
  try {
    // Parse and validate request body

    const id = c.req.param("id");

    if (!id) {
      return c.json(
        {
          success: false,
          error: "Ward ID is required",
        },
        400,
      );
    }

    const body = await c.req.json();

    const validatedData = updateWardSchema.parse(body);

    // Check if ward already exists
    const existingWorker = await db.query.workers.findFirst({
      where: eq(workers.workerId, id),
    });

    if (!existingWorker) {
      return c.json(
        {
          success: false,
          error: "Worker not found",
        },
        404,
      );
    }

    // Update worker
    const [updatedWorker] = await db
      .update(workers)
      .set({
        workerName: validatedData.workerName,
        contactNumber: validatedData.contactNumber,
        wardId: validatedData.wardId,
      })
      .where(eq(workers.workerId, id))
      .returning();

    return c.json(
      {
        success: true,
        data: updatedWorker,
      },
      200,
    );
  } catch (error) {
    console.error("Error updating ward:", error);

    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          error: "Validation error",
          details: error.errors,
        },
        400,
      );
    }

    return c.json(
      {
        success: false,
        error: "Internal server error",
      },
      500,
    );
  }
});

export default app;
