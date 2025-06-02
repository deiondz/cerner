import { useMemo } from "react";

/**
 * Default export configuration for the users data table
 */
export function useExportConfig() {
  // Column mapping for export
  const columnMapping = useMemo(() => {
    return {
      wardId: "Ward ID",
      wardName: "Ward Name",
      supervisorId: "Supervisor ID",
      createdAt: "Created At",
      householdCount: "Household Count",
      workerCount: "Worker Count",
    };
  }, []);

  // Column widths for Excel export
  const columnWidths = useMemo(() => {
    return [
      { wch: 10 }, // Ward ID
      { wch: 20 }, // Ward Name
      { wch: 30 }, // Supervisor ID
      { wch: 20 }, // Created At
      { wch: 15 }, // Household Count
      { wch: 15 }, // Worker Count
    ];
  }, []);

  // Headers for CSV export
  const headers = useMemo(() => {
    return [
      "Ward ID",
      "Ward Name",
      "Supervisor ID",
      "Created At",
      "Household Count",
      "Worker Count",
    ];
  }, []);

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: "wards",
  };
}
