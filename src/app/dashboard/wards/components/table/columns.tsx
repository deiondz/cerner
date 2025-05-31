"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { Ward } from "~/types/ward";

export const columns: ColumnDef<Ward>[] = [
  {
    accessorKey: "name",
    header: "Ward Name",
  },
  {
    accessorKey: "supervisor_name",
    header: "Supervisor Name",
  },
  {
    accessorKey: "worker_count",
    header: "Worker Count",
  },
  {
    accessorKey: "household_count",
    header: "Household Count",
  },

  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      );
    },
  },
];
