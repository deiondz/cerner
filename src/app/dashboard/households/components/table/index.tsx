"use client";

// ** Import Date Table
import { DataTable } from "./data-table";

// ** Import Table Config & Columns
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";

// ** Import Toolbar Options
import { ToolbarOptions } from "./components/toolbar-options";

// ** Import Types
import type { Ward } from "~/server/db/types";
import type { Household } from "./schema";
import { useHouseholdsData } from "./utils/data-fetching";

export default function HouseholdsTable({ wards }: { wards: Ward[] }) {
  return (
    <DataTable<Household, string>
      getColumns={(handleRowDeselection) =>
        getColumns(handleRowDeselection, wards)
      }
      wards={wards}
      exportConfig={useExportConfig()}
      fetchDataFn={useHouseholdsData}
      idField="trackerId"
      pageSizeOptions={[10, 20, 30, 40, 50, 100, 150]}
      renderToolbarContent={({
        selectedRows,
        allSelectedIds,
        totalSelectedCount,
        resetSelection,
      }) => (
        <ToolbarOptions
          wards={wards}
          selectedHouseholds={selectedRows.map((row) => ({
            houseId: row.houseId,
            ownerNumber: row.ownerNumber,
          }))}
          allSelectedHouseholdIds={allSelectedIds}
          totalSelectedCount={totalSelectedCount}
          resetSelection={resetSelection}
        />
      )}
      config={{
        enableRowSelection: false,
        enableClickRowSelect: false,
        enableKeyboardNavigation: true,
        enableSearch: true,
        enableDateFilter: false,
        enableColumnVisibility: true,
        enableUrlState: true,
        columnResizingTableId: "household-table",
      }}
    />
  );
}
