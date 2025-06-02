"use client";

import * as React from "react";

// ** Import Icons
import { TrashIcon } from "lucide-react";

// ** Import UI Components
import { Button } from "~/components/ui/button";

// ** Import Actions
import { AddWardPopup } from "./actions/add-ward-popup";
import { BulkDeletePopup } from "./actions/bulk-delete-popup";
import { type Worker } from "~/server/db/types";

interface ToolbarOptionsProps {
  workers: Worker[];
  // Current page selected users with name data
  selectedWards: { wardId: string; wardName: string }[];
  // All selected user IDs across all pages (for operations that only need IDs)
  allSelectedWardIds?: string[];
  // Total count of selected items across all pages
  totalSelectedCount: number;
  resetSelection: () => void;
}

export const ToolbarOptions = ({
  selectedWards,
  workers,
  allSelectedWardIds = [],
  totalSelectedCount,
  resetSelection,
}: ToolbarOptionsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Use total selected count if available, otherwise fall back to current page selection
  const selectionCount = totalSelectedCount || selectedWards.length;

  // Determine which IDs to use for operations - prefer all selected IDs if available
  const selectedIds =
    allSelectedWardIds.length > 0
      ? allSelectedWardIds
      : selectedWards.map((ward) => ward.wardId);

  return (
    <div className="flex items-center gap-2">
      <AddWardPopup workers={workers} />

      {selectionCount > 0 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({selectionCount})
          </Button>

          <BulkDeletePopup
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            selectedWards={selectedWards}
            allSelectedIds={selectedIds}
            totalSelectedCount={selectionCount}
            resetSelection={resetSelection}
          />
        </>
      )}
    </div>
  );
};
