import { Hono } from "hono";

// ** Import DB
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { households } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

// Create a new Hono app
const app = new Hono();

// DELETE /api/households/:id
app.delete("/", async (c) => {
  try {
    // Parse and validate household ID
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

    // Check if household exists
    const [household] = await db
      .select()
      .from(households)
      .where(eq(households.houseId, id));

    if (!household) {
      return c.json(
        {
          success: false,
          error: "Household not found",
        },
        404,
      );
    }

    // Then delete the household
    await db.delete(households).where(eq(households.houseId, id));

    return c.json(
      {
        success: true,
        message: "Household deleted successfully",
      },
      200,
    );
  } catch (error) {
    console.error("Error deleting household:", error);
    return c.json(
      {
        success: false,
        error: "Failed to delete household",
        details: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

export default app;
