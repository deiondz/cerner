import { useQuery } from "@tanstack/react-query";

// ** Import API
import { fetchWorkers } from "~/api/workers/fetch-worker";

// ** Import Utils
import { preprocessSearch } from "~/components/data-table/utils/search";

/**
 * Hook to fetch users with the current filters and pagination
 */
export function useWorkersData(
  page: number,
  pageSize: number,
  search: string,
  ward: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
) {
  console.log(ward);
  return useQuery({
    queryKey: [
      "workers",
      page,
      pageSize,
      preprocessSearch(search),
      preprocessSearch(ward),
      dateRange,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      fetchWorkers({
        page,
        limit: pageSize,
        ward: preprocessSearch(ward),
        search: preprocessSearch(search),
        from_date: dateRange.from_date,
        to_date: dateRange.to_date,
        sort_by: sortBy,
        sort_order: sortOrder,
      }),
  });
}

// Add a property to the function so we can use it with the DataTable component
useWorkersData.isQueryHook = true;
