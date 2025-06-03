import { Hono } from "hono";

// ** Third Party Libraries
import { z } from "zod";

// ** Drizzle
import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "~/server/db";
import { households, wards, workers } from "~/server/db/schema";

// Create a router
const app = new Hono();

// Schema for query parameters
const querySchema = z.object({
  search: z.string().optional(),
  mobile: z.string().optional(),
  ward: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  sort_by: z
    .enum([
      "workerId",
      "workerName",
      "contactNumber",
      "wardId",
      "dateCreated",
      "status",
      "wardName",
    ])
    .default("dateCreated"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

// Get workers with their details
app.get("/", async (c) => {
  try {
    // Parse and validate query parameters
    const result = querySchema.safeParse(c.req.query());

    if (!result.success) {
      return c.json(
        {
          success: false,
          error: "Invalid query parameters",
          details: result.error.format(),
        },
        400,
      );
    }

    const {
      search,
      ward,
      from_date,
      to_date,
      sort_by,
      sort_order,
      page,
      limit,
    } = result.data;

    // Build filters
    const filters = [];

    // Search filter (search across worker name and contact number)
    if (search) {
      filters.push(
        or(
          ilike(workers.workerName, `%${search}%`),
          ilike(workers.contactNumber, `%${search}%`),
        ),
      );
    }

    // Ward filter
    if (ward) {
      filters.push(ilike(wards.wardName, `%${ward}%`));
    }

    // Date filtering based on worker dateCreated
    if (
      from_date &&
      to_date &&
      from_date.trim() !== "" &&
      to_date.trim() !== ""
    ) {
      filters.push(
        sql`${workers.dateCreated} BETWEEN ${from_date}::timestamp AND ${to_date}::timestamp`,
      );
    } else if (from_date && from_date.trim() !== "") {
      filters.push(sql`${workers.dateCreated} >= ${from_date}::timestamp`);
    } else if (to_date && to_date.trim() !== "") {
      filters.push(sql`${workers.dateCreated} <= ${to_date}::timestamp`);
    }

    // Get workers with their ward details
    const baseSelect = db
      .select({
        workerId: workers.workerId,
        workerName: workers.workerName,
        contactNumber: workers.contactNumber,
        status: workers.status,
        wardName: wards.wardName,
        dateCreated: workers.dateCreated,
      })
      .from(workers)
      .leftJoin(wards, eq(workers.wardId, wards.wardId))
      .where(and(...filters))
      .limit(limit)
      .offset((page - 1) * limit);

    // Add correct sorting
    if (sort_by === "wardName") {
      baseSelect.orderBy(
        sort_order === "asc" ? asc(wards.wardName) : desc(wards.wardName),
      );
    } else {
      const column = workers[sort_by];
      if (!column) {
        throw new Error(`Invalid sort column: ${sort_by}`);
      }
      baseSelect.orderBy(sort_order === "asc" ? asc(column) : desc(column));
    }

    const workersData = await baseSelect;

    // Count total workers (for pagination)
    const totalCount = await db
      .select({ count: count() })
      .from(workers)
      .where(and(...filters))
      .then((result) => result[0]?.count ?? 0);

    return c.json({
      success: true,
      data: workersData,
      pagination: {
        page,
        limit,
        total_pages: Math.ceil(totalCount / limit),
        total_items: totalCount,
      },
    });
  } catch (error) {
    console.error("Error getting workers:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch workers",
        details: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

export default app;
