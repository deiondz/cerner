/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Hono } from "hono";

// ** Import 3rd Party Libs
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { wards } from "~/server/db/schema";

// Create a new Hono app
const app = new Hono();

// Input validation schema
const addWardSchema = z.object({
  wardName: z.string().min(1, "Ward name is required").max(255),
  supervisorId: z.string().uuid("Invalid supervisor ID").optional(),
});

// POST /api/users/add
app.post("/", async (c) => {
  try {
    // Parse and validate request body
    const body = await c.req.json();
    const validatedData = addWardSchema.parse(body);

    // Check if email already exists
    const existingWard = await db.query.wards.findFirst({
      where: eq(wards.wardName, validatedData.wardName),
    });

    if (existingWard) {
      return c.json(
        {
          success: false,
          error: "Ward already exists",
        },
        409,
      );
    }

    // Insert new user
    const [newWard] = await db
      .insert(wards)
      .values({
        wardName: validatedData.wardName,
        supervisorId: validatedData.supervisorId,
      })
      .returning();

    return c.json(
      {
        success: true,
        data: newWard,
      },
      201,
    );
  } catch (error) {
    console.error("Error adding ward:", error);

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
