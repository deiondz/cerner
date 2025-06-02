"use client";

// ** Import 3rd Party Libs
import { type ColumnDef } from "@tanstack/react-table";

// ** Import Components
import { DataTableColumnHeader } from "~/components/data-table/column-header";

// ** Import UI Components
import { Checkbox } from "~/components/ui/checkbox";

// ** Import Schema
import { type Ward } from "../schema";

// ** Import Table Row Actions
import { DataTableRowActions } from "./row-actions";
import type { Worker } from "~/server/db/types";

export const getColumns = (
  handleRowDeselection: ((rowId: string) => void) | null | undefined,
  workers: Worker[],
): ColumnDef<Ward>[] => {
  // Base columns without the select column

  const baseColumns: ColumnDef<Ward>[] = [
    {
      accessorKey: "wardId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ward ID" />
      ),
      cell: ({ row }) => (
        <div className="truncate text-left">{row.getValue("wardId")}</div>
      ),
      size: 70,
    },
    {
      accessorKey: "wardName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="truncate text-left font-medium">
          {row.getValue("wardName")}
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: "supervisorName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Supervisor" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 truncate">
            <span className="truncate font-medium">
              {row.getValue("supervisorName")}
            </span>
          </div>
        );
      },
      size: 250,
    },
    {
      accessorKey: "workerCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Workers" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center truncate">
            <span className="truncate">{row.getValue("workerCount")}</span>
          </div>
        );
      },
      size: 150,
    },
    {
      accessorKey: "householdCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Households" />
      ),
      cell: ({ row }) => {
        return (
          <div className="max-w-full truncate text-left">
            {row.getValue("householdCount")}
          </div>
        );
      },
      size: 80,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row, table }) => (
        <DataTableRowActions workers={workers} row={row} table={table} />
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
