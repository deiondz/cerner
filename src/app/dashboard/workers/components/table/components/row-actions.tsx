"use client";

import * as React from "react";

// ** Import 3rd Party Libs
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";

// ** Import UI Components
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

// ** Import Schema
import { workerSchema } from "../schema";

// ** Import Actions
import type { Ward } from "~/server/db/types";

import { UpdateWorkerPopup } from "./actions/update-worker-popup";
import { DeleteWorkerPopup } from "./actions/delete-worker-popup";
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  table: any; // Table instance
  wards: Ward[];
}

export function DataTableRowActions<TData>({
  row,
  table,
  wards,
}: DataTableRowActionsProps<TData>) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const worker = workerSchema.parse(row.original);

  // Function to reset all selections
  const resetSelection = () => {
    table.resetRowSelection();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setUpdateDialogOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateWorkerPopup
        wards={wards}
        worker={worker}
        currentWorkerName={worker.workerName}
        currentWardId={
          wards.find((ward) => ward.wardName === worker.wardName)?.wardId
        }
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
      />
      <DeleteWorkerPopup
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        workerId={worker.workerId}
        workerName={worker.workerName}
        resetSelection={resetSelection}
      />
    </>
  );
}
