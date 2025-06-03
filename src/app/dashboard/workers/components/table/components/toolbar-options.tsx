"use client";

import * as React from "react";

// ** Import Icons
import { TrashIcon } from "lucide-react";

// ** Import UI Components
import { Button } from "~/components/ui/button";

// ** Import Actions
import { type Ward } from "~/server/db/types";
import { AddWorkerPopup } from "./actions/add-ward-popup";
import { BulkDeletePopup } from "./actions/bulk-delete-popup";

interface ToolbarOptionsProps {
  wards: Ward[];
  // Current page selected workers with name data
  selectedWorkers: { workerId: string; workerName: string }[];
  // All selected worker IDs across all pages (for operations that only need IDs)
  allSelectedWorkerIds?: string[];
  // Total count of selected items across all pages
  totalSelectedCount: number;
  resetSelection: () => void;
}

export const ToolbarOptions = ({
  selectedWorkers,
  wards,
  allSelectedWorkerIds = [],
  totalSelectedCount,
  resetSelection,
}: ToolbarOptionsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Use total selected count if available, otherwise fall back to current page selection
  const selectionCount = totalSelectedCount || selectedWorkers.length;

  // Determine which IDs to use for operations - prefer all selected IDs if available
  const selectedIds =
    allSelectedWorkerIds.length > 0
      ? allSelectedWorkerIds
      : selectedWorkers.map((worker) => worker.workerId);

  return (
    <div className="flex items-center gap-2">
      <AddWorkerPopup wards={wards} />

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
            selectedWorkers={selectedWorkers}
            allSelectedIds={selectedIds}
            totalSelectedCount={selectionCount}
            resetSelection={resetSelection}
          />
        </>
      )}
    </div>
  );
};
