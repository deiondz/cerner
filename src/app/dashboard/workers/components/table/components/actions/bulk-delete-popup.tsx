"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";

// ** Import 3rd Party Libs
import { toast } from "sonner";
import { deleteWorker } from "~/api/workers/delete-worker";

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
  selectedWorkers: { workerId: string; workerName: string }[];
  allSelectedIds?: string[];
  totalSelectedCount?: number;
  resetSelection: () => void;
}

export function BulkDeletePopup({
  open,
  onOpenChange,
  selectedWorkers,
  totalSelectedCount,
  resetSelection,
}: BulkDeletePopupProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = React.useState(false);

  // Use allSelectedIds if available, otherwise fallback to selectedWorkers ids
  const idsToDelete = selectedWorkers.map((worker) => worker.workerId);

  // Use total count if available, otherwise fallback to visible items count
  const itemCount = totalSelectedCount ?? selectedWorkers.length;

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      // Delete workers sequentially
      for (const id of idsToDelete) {
        const response = await deleteWorker(id);
        if (!response.success) {
          throw new Error(`Failed to delete worker ID ${id}`);
        }
      }

      toast.success(
        itemCount === 1
          ? "Worker deleted successfully"
          : `${itemCount} workers deleted successfully`,
      );

      onOpenChange(false);
      resetSelection();
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["workers"] });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete workers",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getDialogTitle = () => {
    if (itemCount === 1) {
      return "Delete Worker";
    }
    return "Delete Workers";
  };

  const getDialogDescription = () => {
    if (itemCount === 1 && selectedWorkers.length === 1) {
      return `Are you sure you want to delete ${selectedWorkers[0]?.workerName}? This action cannot be undone.`;
    }
    return `Are you sure you want to delete ${itemCount} workers? This action cannot be undone.`;
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
