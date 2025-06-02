"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

// ** Import 3rd Party Libs
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// ** Import UI Components
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

// ** Import API
import { updateWard } from "~/api/wards/update-ward";
import type { Worker } from "~/server/db/types";

// Form validation schema
const formSchema = z.object({
  wardId: z.string().uuid("Invalid ward ID"),
  wardName: z.string().min(1, "Name is required").max(255),
  supervisorId: z.string().uuid("Invalid supervisor ID").optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UpdateWardPopupProps {
  workers: Worker[];
  wardId: string;
  currentWardName: string;
  currentSupervisorId?: string | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function UpdateWardPopup({
  workers,
  wardId,
  currentWardName,
  currentSupervisorId,
  onOpenChange,
  open,
}: UpdateWardPopupProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  const queryClient = useQueryClient();

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wardId,
      wardName: currentWardName,
      supervisorId: currentSupervisorId ?? "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      const response = await updateWard(data);

      if (response.success) {
        toast.success("Ward updated successfully");
        form.reset();
        onOpenChange(false);
        router.refresh(); // Refresh the page to show updated data
        await queryClient.invalidateQueries({ queryKey: ["wards"] });
      } else {
        toast.error(response.error ?? "Failed to update ward");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update ward",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Ward</DialogTitle>
          <DialogDescription>
            Update the ward details in the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="wardName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supervisorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                            disabled={workers.length === 0}
                          >
                            {field.value
                              ? workers.find(
                                  (worker) => worker.workerId === field.value,
                                )?.workerName
                              : "Select supervisor"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="min-w-sm overflow-y-auto p-0"
                        side="bottom"
                        align="center"
                        sideOffset={4}
                      >
                        <Command className="h-52 w-full">
                          <CommandInput placeholder="Search supervisor..." />
                          <CommandEmpty>No supervisor found.</CommandEmpty>
                          <CommandGroup className="overflow-y-scroll">
                            {workers.map((worker) => (
                              <CommandItem
                                value={worker.workerId}
                                key={worker.workerId}
                                onSelect={() => {
                                  field.onChange(worker.workerId);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === worker.workerId
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {worker.workerName}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update ward"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
