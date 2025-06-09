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
import { deleteHousehold } from "~/api/households/delete-household";

interface DeleteHouseholdPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  houseId: string;
  ownerNumber: string;
  resetSelection?: () => void;
}

export function DeleteHouseholdPopup({
  open,
  onOpenChange,
  houseId,
  ownerNumber,
  resetSelection,
}: DeleteHouseholdPopupProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await deleteHousehold(houseId);

      if (response.success) {
        toast.success("Household deleted successfully");
        onOpenChange(false);

        await queryClient.invalidateQueries({
          queryKey: ["households"],
        });

        // Reset the selection state if the function is provided
        if (resetSelection) {
          resetSelection();
        }
      } else {
        toast.error(response.error ?? "Failed to delete household");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete household",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Household</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete household with owner number{" "}
            {ownerNumber}? This action cannot be undone.
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
