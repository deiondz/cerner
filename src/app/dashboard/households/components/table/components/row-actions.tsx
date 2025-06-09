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

// ** Import Actions
import type { Ward } from "~/server/db/types";

import { UpdatePopup } from "./actions/updater-popup";
import { DeleteHouseholdPopup } from "./actions/delete-worker-popup";
import { householdSchema } from "../schema";

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
  const household = householdSchema.parse(row.original);

  // Convert boolean status to string and ensure houseId is included
  const householdWithStringStatus = {
    ...household,
    houseId: household.houseId, // Use trackerId as houseId
    status: household.status ? "active" : "inactive",
    trackerId: Number(household.trackerId), // Convert trackerId to number
  };

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
      <UpdatePopup
        wards={wards}
        household={householdWithStringStatus}
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
      />
      <DeleteHouseholdPopup
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        houseId={household.houseId}
        ownerNumber={household.ownerNumber}
        resetSelection={resetSelection}
      />
    </>
  );
}
