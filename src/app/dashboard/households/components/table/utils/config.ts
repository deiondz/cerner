import { useMemo } from "react";

/**
 * Default export configuration for the users data table
 */
export function useExportConfig() {
  // Column mapping for export
  const columnMapping = useMemo(() => {
    return {
      workerId: "Worker ID",
      workerName: "Worker Name",
      contactNumber: "Contact Number",
      status: "Status",
      wardId: "Ward ID",
      dateCreated: "Date Created",
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
      "Worker ID",
      "Worker Name",
      "Contact Number",
      "Status",
      "Ward ID",
      "Date Created",
    ];
  }, []);

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: "workers, phone number",
  };
}
