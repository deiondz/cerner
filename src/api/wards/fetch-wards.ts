// ** Import Schema
import { z } from "zod";

const API_BASE_URL = "/api";

// Ward schema
const wardSchema = z.object({
  wardId: z.string().uuid(),
  wardName: z.string(),
  supervisorId: z.string().uuid().nullable(),
  supervisorName: z.string().nullable(),
  workerCount: z.number(),
  householdCount: z.number(),
  createdAt: z.string(),
});

export type Ward = z.infer<typeof wardSchema>;

export const wardsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(wardSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total_pages: z.number(),
    total_items: z.number(),
  }),
});

/**
 * Fetch wards with their details
 */

export async function fetchWards({
  search = "",
  from_date = "",
  to_date = "",
  sort_by = "wardName",
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
  const response = await fetch(`${API_BASE_URL}/wards?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch wards: ${response.statusText}`);
  }

  const data = (await response.json()) as unknown;
  return wardsResponseSchema.parse(data);
}
