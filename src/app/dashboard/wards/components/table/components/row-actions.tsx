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
import { wardSchema } from "../schema";

// ** Import Actions
import { DeleteWardPopup } from "./actions/delete-ward-popup";
import { UpdateWardPopup } from "./actions/update-ward-popup";
import type { Worker } from "~/server/db/types";
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  table: any; // Table instance
  workers: Worker[];
}

export function DataTableRowActions<TData>({
  row,
  table,
  workers,
}: DataTableRowActionsProps<TData>) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const ward = wardSchema.parse(row.original);
  console.log(workers);
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
      <UpdateWardPopup
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        workers={workers}
        wardId={ward.wardId}
        currentWardName={ward.wardName}
        currentSupervisorId={ward.supervisorId}
      />
      <DeleteWardPopup
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        wardId={ward.wardId}
        wardName={ward.wardName}
        resetSelection={resetSelection}
      />
    </>
  );
}
