import { wardsResponseSchema } from "~/app/dashboard/wards/entity-table/schema/entity-schema";

const API_BASE_URL = "/api";

export async function fetchEntities({
  search = "",
  from_date = "",
  to_date = "",
  sort_by = "created_at",
  sort_order = "desc",
  page = 1,
  limit = 10,
}) {
  // Build query parameters
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (from_date) params.append("from_date", from_date);
  if (to_date) params.append("to_date", to_date);
  params.append("sort_by", sort_by);
  params.append("sort_order", sort_order);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  // Fetch data
  const response = await fetch(`${API_BASE_URL}/entities?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch entities: ${response.statusText}`);
  }

  const data = await response.json();
  return wardsResponseSchema.parse(data);
}
