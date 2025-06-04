"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";

// ** Import 3rd Party Libs
import { toast } from "sonner";

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
import { deleteWard } from "~/api/wards/delete-ward";

interface BulkDeletePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedWards: { wardId: string; wardName: string }[];
  allSelectedIds?: string[];
  totalSelectedCount?: number;
  resetSelection: () => void;
}

export function BulkDeletePopup({
  open,
  onOpenChange,
  selectedWards,
  totalSelectedCount,
  resetSelection,
}: BulkDeletePopupProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = React.useState(false);

  // Use allSelectedIds if available, otherwise fallback to selectedWards ids
  const idsToDelete = selectedWards.map((ward) => ward.wardId);

  // Use total count if available, otherwise fallback to visible items count
  const itemCount = totalSelectedCount ?? selectedWards.length;

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      // Delete wards sequentially
      for (const id of idsToDelete) {
        const response = await deleteWard(id);
        if (!response.success) {
          throw new Error(`Failed to delete ward ID ${id}`);
        }
      }

      toast.success(
        itemCount === 1
          ? "Ward deleted successfully"
          : `${itemCount} wards deleted successfully`,
      );

      onOpenChange(false);
      resetSelection();

      await queryClient.invalidateQueries({ queryKey: ["wards"] });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete wards",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getDialogTitle = () => {
    if (itemCount === 1) {
      return "Delete Ward";
    }
    return "Delete Wards";
  };

  const getDialogDescription = () => {
    if (itemCount === 1 && selectedWards.length === 1) {
      return `Are you sure you want to delete ${selectedWards[0]?.wardName}? This action cannot be undone.`;
    }
    return `Are you sure you want to delete ${itemCount} wards? This action cannot be undone.`;
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
