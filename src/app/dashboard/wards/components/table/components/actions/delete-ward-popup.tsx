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
import { deleteWard } from "~/api/wards/delete-ward";

interface DeleteWardPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wardId: string;
  wardName: string;
  resetSelection?: () => void;
}

export function DeleteWardPopup({
  open,
  onOpenChange,
  wardId,
  wardName,
  resetSelection,
}: DeleteWardPopupProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await deleteWard(wardId);

      if (response.success) {
        toast.success("Ward deleted successfully");
        onOpenChange(false);
        // Refresh data
        router.refresh();
        await queryClient.invalidateQueries({ queryKey: ["wards"] });
        // Reset the selection state if the function is provided
        if (resetSelection) {
          resetSelection();
        }
      } else {
        toast.error(response.error ?? "Failed to delete ward");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete ward",
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
            Are you sure you want to delete {wardName}? This action cannot be
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
