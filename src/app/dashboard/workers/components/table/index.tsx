"use client";

// ** Import Date Table
import { DataTable } from "./data-table";

// ** Import Table Config & Columns
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";

// ** Import Toolbar Options
import { ToolbarOptions } from "./components/toolbar-options";

// ** Import Types

import type { Ward, WorkerTableData } from "~/server/db/types";
import { useWorkersData } from "./utils/data-fetching";

export default function WorkersTable({ wards }: { wards: Ward[] }) {
  return (
    <DataTable<WorkerTableData, string>
      getColumns={(handleRowDeselection) =>
        getColumns(handleRowDeselection, wards)
      }
      wards={wards}
      exportConfig={useExportConfig()}
      fetchDataFn={useWorkersData}
      idField="workerId"
      pageSizeOptions={[10, 20, 30, 40, 50, 100, 150]}
      renderToolbarContent={({
        selectedRows,
        allSelectedIds,
        totalSelectedCount,
        resetSelection,
      }) => (
        <ToolbarOptions
          wards={wards}
          selectedWorkers={selectedRows.map((row) => ({
            workerId: row.workerId,
            workerName: row.workerName,
          }))}
          allSelectedWorkerIds={allSelectedIds}
          totalSelectedCount={totalSelectedCount}
          resetSelection={resetSelection}
        />
      )}
      config={{
        enableRowSelection: true,
        enableClickRowSelect: false,
        enableKeyboardNavigation: true,
        enableSearch: true,
        enableDateFilter: false,
        enableColumnVisibility: true,
        enableUrlState: true,
        columnResizingTableId: "worker-table",
      }}
    />
  );
}
