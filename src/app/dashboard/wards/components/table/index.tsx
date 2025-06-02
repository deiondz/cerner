"use client";

// ** Import Date Table
import { DataTable } from "./data-table";

// ** Import Table Config & Columns
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";

import { useWardsData } from "./utils/data-fetching";

// ** Import Toolbar Options
import { ToolbarOptions } from "./components/toolbar-options";

// ** Import Types
import { type Ward } from "./schema";
import type { Worker } from "~/server/db/types";

export default function WardsTable({ workers }: { workers: Worker[] }) {
  return (
    <DataTable<Ward, string>
      getColumns={getColumns}
      exportConfig={useExportConfig()}
      fetchDataFn={useWardsData}
      idField="wardId"
      pageSizeOptions={[10, 20, 30, 40, 50, 100, 150]}
      renderToolbarContent={({
        selectedRows,
        allSelectedIds,
        totalSelectedCount,
        resetSelection,
      }) => (
        <ToolbarOptions
          selectedWards={selectedRows.map((row) => ({
            wardId: row.wardId,
            wardName: row.wardName,
          }))}
          workers={workers}
          allSelectedWardIds={allSelectedIds}
          totalSelectedCount={totalSelectedCount}
          resetSelection={resetSelection}
        />
      )}
      config={{
        enableRowSelection: true,
        enableClickRowSelect: false,
        enableKeyboardNavigation: true,
        enableSearch: true,
        enableDateFilter: true,
        enableColumnVisibility: true,
        enableUrlState: true,
        columnResizingTableId: "user-table",
      }}
    />
  );
}
