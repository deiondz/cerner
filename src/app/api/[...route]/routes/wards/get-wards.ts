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
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  sort_by: z
    .enum([
      "wardId",
      "wardName",
      "supervisorId",
      "createdAt",
      "householdCount",
      "workerCount",
    ])
    .default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

// Get wards with expenses (including aggregation and filtering)
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

    const { search, from_date, to_date, sort_by, sort_order, page, limit } =
      result.data;

    // Build filters
    const filters = [];

    // Search filter (search across multiple user fields)
    if (search) {
      filters.push(
        or(
          ilike(wards.wardName, `%${search}%`),
          ilike(wards.supervisorId, `%${search}%`),
        ),
      );
    }

    // Date filtering based on user createdAt
    // Only apply if there are non-empty values
    if (
      from_date &&
      to_date &&
      from_date.trim() !== "" &&
      to_date.trim() !== ""
    ) {
      // Date range filter
      filters.push(
        sql`${wards.createdAt} BETWEEN ${from_date}::timestamp AND ${to_date}::timestamp`,
      );
    } else if (from_date && from_date.trim() !== "") {
      // Single date filter: wards created on or after specific date
      filters.push(sql`${wards.createdAt} >= ${from_date}::timestamp`);
    } else if (to_date && to_date.trim() !== "") {
      // wards created on or before specific date
      filters.push(sql`${wards.createdAt} <= ${to_date}::timestamp`);
    }
    // If both are empty or undefined, no date filter will be applied

    // Get wards with expense aggregations
    const baseSelect = db
      .select({
        wardId: wards.wardId,
        wardName: wards.wardName,
        supervisorId: wards.supervisorId,
        supervisorName: workers.workerName,
        createdAt: wards.createdAt,
        workerCount: sql<number>`(
          SELECT CAST(COUNT(*) AS INTEGER)
          FROM ${workers}
          WHERE ${workers.wardId} = ${wards.wardId}
        )`,
        householdCount: sql<number>`(
          SELECT CAST(COUNT(*) AS INTEGER)
          FROM ${households}
          WHERE ${households.wardId} = ${wards.wardId}
        )`,
      })
      .from(wards)
      .leftJoin(workers, eq(wards.supervisorId, workers.workerId))
      .where(and(...filters))
      .limit(limit)
      .offset((page - 1) * limit);

    // Add correct sorting
    if (sort_by === "workerCount") {
      baseSelect.orderBy(
        sort_order === "desc"
          ? sql`(
              SELECT CAST(COUNT(*) AS INTEGER)
              FROM ${workers}
              WHERE ${workers.wardId} = ${wards.wardId}
            ) ASC`
          : sql`(
              SELECT CAST(COUNT(*) AS INTEGER)
              FROM ${workers}
              WHERE ${workers.wardId} = ${wards.wardId}
            ) DESC`,
      );
    } else if (sort_by === "householdCount") {
      baseSelect.orderBy(
        sort_order === "desc"
          ? sql`(
              SELECT CAST(COUNT(*) AS INTEGER)
              FROM ${households}
              WHERE ${households.wardId} = ${wards.wardId}
            ) ASC`
          : sql`(
              SELECT CAST(COUNT(*) AS INTEGER)
              FROM ${households}
              WHERE ${households.wardId} = ${wards.wardId}
            ) DESC`,
      );
    } else {
      const column = wards[sort_by];
      if (!column) {
        throw new Error(`Invalid sort column: ${sort_by}`);
      }
      baseSelect.orderBy(sort_order === "asc" ? asc(column) : desc(column));
    }

    const wardsData = await baseSelect;

    //ount total wards (for pagination)
    const totalCount = await db
      .select({ count: count() })
      .from(wards)
      .where(and(...filters))
      .then((result) => result[0]?.count ?? 0);

    return c.json({
      success: true,
      data: wardsData,
      pagination: {
        page,
        limit,
        total_pages: Math.ceil(totalCount / limit),
        total_items: totalCount,
      },
    });
  } catch (error) {
    console.error("Error getting wards:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch wards",
        details: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

export default app;
