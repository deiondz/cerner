"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

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

import { deleteWorker } from "~/api/workers/delete-worker";

interface DeleteWorkerPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workerId: string;
  workerName: string;
  resetSelection?: () => void;
}

export function DeleteWorkerPopup({
  open,
  onOpenChange,
  workerId,
  workerName,
  resetSelection,
}: DeleteWorkerPopupProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await deleteWorker(workerId);

      if (response.success) {
        toast.success("Worker deleted successfully");
        onOpenChange(false);

        await queryClient.invalidateQueries({
          queryKey: ["workers"],
        });

        // Reset the selection state if the function is provided
        if (resetSelection) {
          resetSelection();
        }
      } else {
        toast.error(response.error ?? "Failed to delete worker");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete worker",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {workerName}? This action cannot be
            undone.
          </DialogDescription>
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
