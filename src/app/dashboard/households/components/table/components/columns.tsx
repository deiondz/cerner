"use client";

// ** Import 3rd Party Libs
import { type ColumnDef } from "@tanstack/react-table";

// ** Import Components
import { DataTableColumnHeader } from "~/components/data-table/column-header";

// ** Import UI Components
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";

// ** Import Table Row Actions
import type { Ward } from "~/server/db/types";
import { DataTableRowActions } from "./row-actions";
import type { Household } from "../schema";

export const getColumns = (
  handleRowDeselection: ((rowId: string) => void) | null | undefined,
  wards: Ward[],
): ColumnDef<Household>[] => {
  // Base columns without the select column
  const baseColumns: ColumnDef<Household>[] = [
    {
      accessorKey: "houseId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="House ID" />
      ),
      cell: ({ row }) => (
        <div className="truncate text-left">{row.getValue("houseId")}</div>
      ),
      size: 70,
    },
    {
      accessorKey: "trackerId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tracker ID" />
      ),
      cell: ({ row }) => (
        <div className="truncate text-left">
          {row.getValue("trackerId") ?? "N/A"}
        </div>
      ),
      size: 70,
    },
    {
      accessorKey: "ownerNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Owner Number" />
      ),
      cell: ({ row }) => (
        <div className="truncate text-left font-medium">
          {row.getValue("ownerNumber")}
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Address" />
      ),
      cell: ({ row }) => (
        <div className="truncate text-left font-medium">
          {row.getValue("address")}
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
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");

        return (
          <div className="flex items-center truncate">
            <Badge variant={status === "active" ? "default" : "secondary"}>
              {status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>
        );
      },
      size: 150,
    },
    {
      accessorKey: "dateCreated",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date Created" />
      ),
      cell: ({ row }) => (
        <div className="truncate text-left font-medium">
          {row.getValue("dateCreated")}
        </div>
      ),
      size: 200,
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
