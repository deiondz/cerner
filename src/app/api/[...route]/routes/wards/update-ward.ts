import { Hono } from "hono";

// ** Import 3rd Party Libs
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { wards } from "~/server/db/schema";

// Create a new Hono app
const app = new Hono();

// Input validation schema
const updateWardSchema = z.object({
  wardId: z.string().uuid("Invalid ward ID"),
  wardName: z.string().min(1, "Ward name is required").max(255),
  supervisorId: z.string().uuid("Invalid supervisor ID").optional(),
});

// POST /api/users/add
app.put("/", async (c) => {
  try {
    // Parse and validate request body
    const body = await c.req.json();
    const validatedData = updateWardSchema.parse(body);

    // Check if ward already exists
    const existingWard = await db.query.wards.findFirst({
      where: eq(wards.wardId, validatedData.wardId),
    });

    if (!existingWard) {
      return c.json(
        {
          success: false,
          error: "Ward not found",
        },
        404,
      );
    }

    // Update ward
    const [updatedWard] = await db
      .update(wards)
      .set({
        wardName: validatedData.wardName,
        supervisorId: validatedData.supervisorId,
      })
      .where(eq(wards.wardId, validatedData.wardId))
      .returning();

    return c.json(
      {
        success: true,
        data: updatedWard,
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
