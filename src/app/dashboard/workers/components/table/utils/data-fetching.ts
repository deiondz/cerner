import { keepPreviousData, useQuery } from "@tanstack/react-query";

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
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
) {
  return useQuery({
    queryKey: [
      "workers",
      page,
      pageSize,
      preprocessSearch(search),
      dateRange,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      fetchWorkers({
        page,
        limit: pageSize,
        search: preprocessSearch(search),
        from_date: dateRange.from_date,
        to_date: dateRange.to_date,
        sort_by: sortBy,
        sort_order: sortOrder,
      }),
    // placeholderData: keepPreviousData, // Keep previous data when fetching new data. If skeleton animation is needed when fetching data, comment this out.
  });
}

// Add a property to the function so we can use it with the DataTable component
useWorkersData.isQueryHook = true;
