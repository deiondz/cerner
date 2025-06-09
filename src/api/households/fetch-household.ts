// ** Import Schema
import { z } from "zod";

const API_BASE_URL = "/api";

// Household schema
const householdSchema = z.object({
  houseId: z.string().uuid(),
  ownerNumber: z.string(),
  address: z.string(),
  wardId: z.string().uuid().nullable(),
  wardName: z.string().nullable(),
  status: z.string(),
  trackerId: z.number().nullable(),
  dateCreated: z.string(),
  dateUpdated: z.string(),
});

export type Household = z.infer<typeof householdSchema>;

export const householdsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(householdSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total_pages: z.number(),
    total_items: z.number(),
  }),
});

/**
 * Fetch households with their details
 */
export async function fetchHouseholds({
  search = "",
  ward = "",
  from_date = "",
  to_date = "",
  sort_by = "dateCreated",
  sort_order = "desc",
  page = 1,
  limit = 10,
}: {
  search?: string;
  ward?: string;
  from_date?: string;
  to_date?: string;
  sort_by?: string;
  sort_order?: string;
  page?: number;
  limit?: number;
}) {
  // Process search term - trim and sanitize
  const processedSearch = search ? search.trim().replace(/\s+/g, " ") : "";
  const processedWard = ward ? ward.trim().replace(/\s+/g, " ") : "";
  // Build query parameters
  const params = new URLSearchParams();
  if (processedSearch) params.append("search", processedSearch);
  if (processedWard) params.append("ward", processedWard);
  if (from_date) params.append("from_date", from_date);
  if (to_date) params.append("to_date", to_date);
  params.append("sort_by", sort_by);
  params.append("sort_order", sort_order);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  // Fetch data
  const response = await fetch(
    `${API_BASE_URL}/households?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch households: ${response.statusText}`);
  }

  const data = (await response.json()) as unknown;
  return householdsResponseSchema.parse(data);
}
