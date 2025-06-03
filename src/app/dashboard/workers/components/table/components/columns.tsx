"use client";

// ** Import 3rd Party Libs
import { type ColumnDef } from "@tanstack/react-table";

// ** Import Components
import { DataTableColumnHeader } from "~/components/data-table/column-header";

// ** Import UI Components
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";

// ** Import Table Row Actions
import type { Ward, WorkerTableData } from "~/server/db/types";
import { DataTableRowActions } from "./row-actions";

export const getColumns = (
  handleRowDeselection: ((rowId: string) => void) | null | undefined,
  wards: Ward[],
): ColumnDef<WorkerTableData>[] => {
  // Base columns without the select column

  const baseColumns: ColumnDef<WorkerTableData>[] = [
    {
      accessorKey: "workerId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Worker ID" />
      ),
      cell: ({ row }) => (
        <div className="truncate text-left">{row.getValue("workerId")}</div>
      ),
      size: 70,
    },
    {
      accessorKey: "workerName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="truncate text-left font-medium">
          {row.getValue("workerName")}
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: "wardName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ward" />
      ),
      cell: ({ row }) => (
        <div className="truncate text-left font-medium">
          {row.getValue("wardName")}
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: "contactNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact Number" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 truncate">
            <span className="truncate font-medium">
              {row.getValue("contactNumber")}
            </span>
          </div>
        );
      },
      size: 250,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");

        return (
          <div className="flex items-center truncate">
            <Badge variant={status ? "default" : "secondary"}>
              {status ? "Active" : "Inactive"}
            </Badge>
          </div>
        );
      },
      size: 150,
    },

    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row, table }) => (
        <DataTableRowActions row={row} table={table} wards={wards} />
      ),
      size: 100,
    },
  ];

  // Only include the select column if row selection is enabled
  if (handleRowDeselection !== null) {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <div className="truncate pl-2">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
              className="translate-y-0.5 cursor-pointer"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="truncate pl-2">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                if (value) {
                  row.toggleSelected(true);
                } else {
                  row.toggleSelected(false);
                  // If we have a deselection handler, use it for better cross-page tracking
                  if (handleRowDeselection) {
                    handleRowDeselection(row.id);
                  }
                }
              }}
              aria-label="Select row"
              className="translate-y-0.5 cursor-pointer"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      },
      ...baseColumns,
    ];
  }

  // Return only the base columns if row selection is disabled
  return baseColumns;
};
