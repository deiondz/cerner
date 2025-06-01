"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";

import type { Ward } from "~/server/db/types";

function ActionsCell({ ward }: { ward: Ward }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>

      {/* <EditWardModal
        wardCode={ward.ward_code}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          // Refresh the table data
          window.location.reload();
        }}
      /> */}

      {/* <DeleteWardModal
        wardCode={ward.ward_code}
        wardName={ward.name}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={() => {
          // Refresh the table data
          window.location.reload();
        }}
      /> */}
    </>
  );
}

export const columns: ColumnDef<Ward>[] = [
  {
    accessorKey: "wardName",
    header: "Ward Name",
  },
  {
    accessorKey: "supervisorName",
    header: "Supervisor Name",
  },
  {
    accessorKey: "workerCount",
    header: "Worker Count",
  },
  {
    accessorKey: "householdCount",
    header: "Household Count",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell ward={row.original} />,
  },
];
