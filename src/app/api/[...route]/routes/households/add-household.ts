import { Hono } from "hono";

// ** Import 3rd Party Libs
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { households, wards } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

// Create a new Hono app
const app = new Hono();

// Input validation schema
const addHouseholdSchema = z.object({
  ownerNumber: z.string().min(1, "Owner number is required").max(255),
  address: z.string().min(1, "Address is required").max(255),
  wardId: z.string().uuid("Invalid ward ID").optional(),
  status: z.string().min(1, "Status is required").max(255),
  trackerId: z.number().optional(),
});

// POST /api/households/add
app.post("/", async (c) => {
  try {
    // Parse and validate request body
    const body = await c.req.json();
    const validatedData = addHouseholdSchema.parse(body);

    // Check if household already exists
    const existingHousehold = await db.query.households.findFirst({
      where: eq(households.ownerNumber, validatedData.ownerNumber),
    });

    if (existingHousehold) {
      return c.json(
        {
          success: false,
          error: "Household already exists",
        },
        409,
      );
    }

    const [newHousehold] = await db
      .insert(households)
      .values({
        ownerNumber: validatedData.ownerNumber,
        address: validatedData.address,
        wardId: validatedData.wardId,
        status: validatedData.status,
        trackerId: validatedData.trackerId,
      })
      .returning();

    return c.json(
      {
        success: true,
        data: newHousehold,
      },
      201,
    );
  } catch (error) {
    console.error("Error adding household:", error);

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
