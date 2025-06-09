import { useQuery } from "@tanstack/react-query";
import { fetchHouseholds } from "~/api/households/fetch-household";

// ** Import API

// ** Import Utils
import { preprocessSearch } from "~/components/data-table/utils/search";

/**
 * Hook to fetch users with the current filters and pagination
 */
export function useHouseholdsData(
  page: number,
  pageSize: number,
  search: string,
  ward: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
) {
  return useQuery({
    queryKey: [
      "households",
      page,
      pageSize,
      preprocessSearch(search),
      preprocessSearch(ward),
      dateRange,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      fetchHouseholds({
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
useHouseholdsData.isQueryHook = true;
