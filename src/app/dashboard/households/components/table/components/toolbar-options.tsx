"use client";

import * as React from "react";

// ** Import Icons
import { TrashIcon } from "lucide-react";

// ** Import UI Components
import { Button } from "~/components/ui/button";

// ** Import Actions
import { type Ward } from "~/server/db/types";
import { BulkDeletePopup } from "./actions/bulk-delete-popup";
import { AddPopup } from "./actions/add-popup";

interface ToolbarOptionsProps {
  wards: Ward[];
  // Current page selected households with name data
  selectedHouseholds: {
    houseId: string;
    ownerNumber: string;
  }[];
  // All selected household IDs across all pages (for operations that only need IDs)
  allSelectedHouseholdIds?: string[];
  // Total count of selected items across all pages
  totalSelectedCount: number;
  resetSelection: () => void;
}

export const ToolbarOptions = ({
  selectedHouseholds,
  wards,
  allSelectedHouseholdIds = [],
  totalSelectedCount,
  resetSelection,
}: ToolbarOptionsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Use total selected count if available, otherwise fall back to current page selection
  const selectionCount = totalSelectedCount || selectedHouseholds.length;

  // Determine which IDs to use for operations - prefer all selected IDs if available
  const selectedIds =
    allSelectedHouseholdIds.length > 0
      ? allSelectedHouseholdIds
      : selectedHouseholds.map((household) => household.houseId);

  return (
    <div className="flex items-center gap-2">
      <AddPopup wards={wards} />

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
            selectedHouseholds={selectedHouseholds}
            allSelectedIds={selectedIds}
            totalSelectedCount={selectionCount}
            resetSelection={resetSelection}
          />
        </>
      )}
    </div>
  );
};
