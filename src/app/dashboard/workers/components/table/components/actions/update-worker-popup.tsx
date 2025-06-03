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
import { updateWorker } from "~/api/workers/update-worker";
import type { Ward, WorkerTableData } from "~/server/db/types";

// Form validation schema
const formSchema = z.object({
  workerId: z.string().uuid("Invalid worker ID"),
  workerName: z.string().min(1, "Name is required").max(255),
  wardId: z.string().uuid("Invalid ward ID").optional(),
  contactNumber: z.string().min(1, "Contact number is required").max(255),
  status: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UpdateWorkersPopupProps {
  wards: Ward[];
  worker: {
    workerId: string;
    contactNumber: string;
    status?: boolean;
  };
  currentWorkerName: string;
  currentWardId?: string | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function UpdateWorkerPopup({
  wards,
  worker,
  currentWorkerName,
  currentWardId,
  onOpenChange,
  open,
}: UpdateWorkersPopupProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  const queryClient = useQueryClient();

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workerId: worker.workerId,
      workerName: currentWorkerName,
      wardId: currentWardId ?? "",
      contactNumber: worker.contactNumber,
      status: worker.status ?? false,
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      const response = await updateWorker(data);

      if (response.success) {
        toast.success("Ward updated successfully");
        form.reset();
        onOpenChange(false);
        router.refresh(); // Refresh the page to show updated data
        await queryClient.invalidateQueries({ queryKey: ["workers"] });
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
          <DialogTitle>Update Worker</DialogTitle>
          <DialogDescription>
            Update the worker details in the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="workerName"
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
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ward</FormLabel>
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
                            disabled={wards.length === 0}
                          >
                            {field.value
                              ? wards.find(
                                  (ward) => ward.wardId === field.value,
                                )?.wardName
                              : "Select ward"}
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
                        <Command
                          className="h-52 w-full"
                          filter={(value, search) => {
                            const ward = wards.find((w) => w.wardId === value);
                            if (!ward) return 0;
                            const wardName = ward.wardName.toLowerCase();
                            const searchTerm = search.toLowerCase();

                            // If ward name starts with search term, give it highest priority (2)
                            if (wardName.startsWith(searchTerm)) return 2;
                            // If ward name contains search term, give it lower priority (1)
                            if (wardName.includes(searchTerm)) return 1;
                            // No match
                            return 0;
                          }}
                        >
                          <CommandInput placeholder="Search ward..." />
                          <CommandEmpty>No ward found.</CommandEmpty>
                          <CommandGroup className="overflow-y-scroll">
                            {wards
                              .sort((a, b) =>
                                a.wardName.localeCompare(b.wardName),
                              )
                              .map((ward) => (
                                <CommandItem
                                  value={ward.wardId}
                                  key={ward.wardId}
                                  onSelect={() => {
                                    field.onChange(ward.wardId);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === ward.wardId
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {ward.wardName}
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
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
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
                          >
                            {field.value ? "Active" : "Inactive"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="min-w-sm p-0">
                        <Command>
                          <CommandInput placeholder="Search status..." />
                          <CommandEmpty>No status found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value="active"
                              onSelect={() => {
                                field.onChange(true);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === true
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              Active
                            </CommandItem>
                            <CommandItem
                              value="inactive"
                              onSelect={() => {
                                field.onChange(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === false
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              Inactive
                            </CommandItem>
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
