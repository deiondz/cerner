import { Hono } from "hono";

// ** Import DB

// ** Import Drizzle
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { wards } from "~/server/db/schema";

// Create a new Hono app
const app = new Hono();

// DELETE /api/wards/:id
app.delete("/", async (c) => {
  try {
    // Parse and validate ward ID
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

    // Check if ward exists
    const [ward] = await db.select().from(wards).where(eq(wards.wardId, id));

    if (!ward) {
      return c.json(
        {
          success: false,
          error: "Ward not found",
        },
        404,
      );
    }

    // Then delete the ward
    await db.delete(wards).where(eq(wards.wardId, id));

    return c.json(
      {
        success: true,
        message: "Ward deleted successfully",
      },
      200,
    );
  } catch (error) {
    console.error("Error deleting ward:", error);
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
