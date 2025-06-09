import { Hono } from "hono";

// ** Import 3rd Party Libs
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/server/db";
import { households } from "~/server/db/schema";

// Create a new Hono app
const app = new Hono();

// Input validation schema
const updateHouseholdSchema = z.object({
  houseId: z.string().uuid("Invalid household ID"),
  ownerNumber: z.string().min(1, "Owner number is required").max(255),
  address: z.string().min(1, "Address is required").max(255),
  wardId: z.string().uuid("Invalid ward ID").optional(),
  status: z.string().min(1, "Status is required").max(255),
});

// PUT /api/households/:id
app.put("/", async (c) => {
  try {
    // Parse and validate request body
    const id = c.req.param("id");

    if (!id) {
      return c.json(
        {
          success: false,
          error: "Household ID is required",
        },
        400,
      );
    }

    const body = await c.req.json();
    const validatedData = updateHouseholdSchema.parse(body);

    // Check if household exists
    const existingHousehold = await db.query.households.findFirst({
      where: eq(households.houseId, id),
    });

    if (!existingHousehold) {
      return c.json(
        {
          success: false,
          error: "Household not found",
        },
        404,
      );
    }

    // Update household
    const [updatedHousehold] = await db
      .update(households)
      .set({
        ownerNumber: validatedData.ownerNumber,
        address: validatedData.address,
        wardId: validatedData.wardId,
        status: validatedData.status,
        dateUpdated: new Date().toISOString(),
      })
      .where(eq(households.houseId, id))
      .returning();

    return c.json(
      {
        success: true,
        data: updatedHousehold,
      },
      200,
    );
  } catch (error) {
    console.error("Error updating household:", error);

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
