// ** Import Schema
import { z } from "zod";

const API_BASE_URL = "/api";

// Worker schema
const workerSchema = z.object({
  workerId: z.string().uuid(),
  workerName: z.string(),
  wardName: z.string().nullable(),
  status: z.boolean(),
  dateCreated: z.string(),
  contactNumber: z.string(),
});

export type Worker = z.infer<typeof workerSchema>;

export const workersResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(workerSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total_pages: z.number(),
    total_items: z.number(),
  }),
});

/**
 * Fetch workers with their details
 */

export async function fetchWorkers({
  search = "",
  from_date = "",
  to_date = "",
  sort_by = "workerName",
  sort_order = "asc",
  page = 1,
  limit = 10,
}: {
  search?: string;
  from_date?: string;
  to_date?: string;
  sort_by?: string;
  sort_order?: string;
  page?: number;
  limit?: number;
}) {
  // Process search term - trim and sanitize
  const processedSearch = search ? search.trim().replace(/\s+/g, " ") : "";

  // Build query parameters
  const params = new URLSearchParams();
  if (processedSearch) params.append("search", processedSearch);
  if (from_date) params.append("from_date", from_date);
  if (to_date) params.append("to_date", to_date);
  params.append("sort_by", sort_by);
  params.append("sort_order", sort_order);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  // Fetch data
  const response = await fetch(`${API_BASE_URL}/workers?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch workers: ${response.statusText}`);
  }

  const data = (await response.json()) as unknown;
  return workersResponseSchema.parse(data);
}
