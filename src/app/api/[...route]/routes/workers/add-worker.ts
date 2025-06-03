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
const addWorkerSchema = z.object({
  workerName: z.string().min(1, "Worker name is required").max(255),
  contactNumber: z.string().min(1, "Contact number is required").max(255),
  wardId: z.string().uuid("Invalid ward ID").optional(),
  status: z.boolean().optional(),
});

// POST /api/workers/add
app.post("/", async (c) => {
  try {
    // Parse and validate request body
    const body = await c.req.json();
    const validatedData = addWorkerSchema.parse(body);

    // Check if email already exists
    const existingWorker = await db.query.workers.findFirst({
      where: eq(workers.contactNumber, validatedData.contactNumber),
    });

    if (existingWorker) {
      return c.json(
        {
          success: false,
          error: "Worker already exists",
        },
        409,
      );
    }

    const [newWorker] = await db
      .insert(workers)
      .values({
        workerName: validatedData.workerName,
        contactNumber: validatedData.contactNumber,
        wardId: validatedData.wardId,
        status: validatedData.status,
      })
      .returning();
    revalidatePath("/dashboard/workers");
    return c.json(
      {
        success: true,
        data: newWorker,
      },
      201,
    );
  } catch (error) {
    console.error("Error adding worker:", error);

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
