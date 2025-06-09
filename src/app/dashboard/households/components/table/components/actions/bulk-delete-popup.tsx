"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";

// ** Import 3rd Party Libs
import { toast } from "sonner";
import { deleteHousehold } from "~/api/households/delete-household";

// ** Import UI Components
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

// ** Import API

interface BulkDeletePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedHouseholds: {
    houseId: string;
    ownerNumber: string;
  }[];
  allSelectedIds?: string[];
  totalSelectedCount?: number;
  resetSelection: () => void;
}

export function BulkDeletePopup({
  open,
  onOpenChange,
  selectedHouseholds,
  totalSelectedCount,
  resetSelection,
}: BulkDeletePopupProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = React.useState(false);

  // Use allSelectedIds if available, otherwise fallback to selectedHouseholds ids
  const idsToDelete = selectedHouseholds.map((household) => household.houseId);

  // Use total count if available, otherwise fallback to visible items count
  const itemCount = totalSelectedCount ?? selectedHouseholds.length;

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      // Delete households sequentially
      for (const id of idsToDelete) {
        const response = await deleteHousehold(id);
        if (!response.success) {
          throw new Error(`Failed to delete household ID ${id}`);
        }
      }

      toast.success(
        itemCount === 1
          ? "Household deleted successfully"
          : `${itemCount} households deleted successfully`,
      );

      onOpenChange(false);
      resetSelection();

      await queryClient.invalidateQueries({ queryKey: ["households"] });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete households",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getDialogTitle = () => {
    if (itemCount === 1) {
      return "Delete Household";
    }
    return "Delete Households";
  };

  const getDialogDescription = () => {
    if (itemCount === 1 && selectedHouseholds.length === 1) {
      return `Are you sure you want to delete household with owner number ${selectedHouseholds[0]?.ownerNumber}? This action cannot be undone.`;
    }
    return `Are you sure you want to delete ${itemCount} households? This action cannot be undone.`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
